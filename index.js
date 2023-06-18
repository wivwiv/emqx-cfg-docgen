const fs = require('fs')
const path = require('path')

function getAllJSON() {
  const json = {}
  const jsonBasePath = path.join(__dirname, '../dist/emqx/json')
  const datalist = fs.readdirSync(jsonBasePath).filter($ => $.endsWith('.json'))

  datalist.forEach(file => {
    const filePath = path.join(jsonBasePath, file)
    const data = require(filePath)
    const filename = file.replace('.json', '')
    json[filename] = data
  })
  return json
}

function getFieldDefaultValue(field) {
  field.default = field.default || {}
  let raw_default = field.raw_default
  if (Array.isArray(raw_default) && typeof raw_default[0] === 'number') {
    raw_default = String.fromCharCode(...raw_default)
  }
  let defaultFieldValue = raw_default || field.default.hocon || ''
  if (typeof defaultFieldValue === 'object') {
    defaultFieldValue = JSON.stringify(defaultFieldValue)
  }
  return defaultFieldValue
}

// 转为释义表格
// 配置项 类型 默认值 说明
function fields2data(fields, prefix, s, edition, lang) {
  const zhHeader = `| 配置项                         | 类型     | 默认值                   | 可选值 | 说明                                                         |
  | ------------------------------ | -------- | ------------------------ | ------ | ------------------------------------------------------------ |`
  const enHeader = `| Items                         | Data Type     | Default                   | Optional values | Description                                                         |
  | ------------------------------ | -------- | ------------------------ | ------ | ------------------------------------------------------------ |`
  const header = lang === 'en' ? enHeader : zhHeader

  const body = []
  const md = []
  const datalist = []
  fields.forEach(field => {
    let { name, desc } = field
    let defaultValue = getFieldDefaultValue(field)

    function removeEMQXSelfPrefix(_type) {
      return _type
        .replace('emqx_schema:', '')
        .replace('emqx_conf_schema:', '')
        .replace('emqx_limiter_schema:', '')
    }

    let type = null
    let allowValue = null
    if (field.type.name) {
      type = field.type.name.replace('()', '')
      type = removeEMQXSelfPrefix(type)

      // 整数 + 取值范围
      if (type.includes('..')) {
        allowValue = `\`${type.replace('..', '-')}\``
        type = 'integer'
      }
    } else if (field.type.kind === 'enum') {
      type = 'enum'
      allowValue = '`' + field.type.symbols.join(' \| ') + '`'
    } else if (field.type.kind === 'union') {
      // 支持多种类型的配置
      // 如果是引用类型则加上超链接
      allowValue = field.type.members.map($ => {
        $.name = $.name || $.kind
        let _type = $.name.replace('()', '')
        _type = removeEMQXSelfPrefix(_type)
        if (_type.includes(':')) {
          // [auth:hash](#auth:hash)
          return `[${$.name}](#${$.name})`
        }
        if (_type === 'binary') {
          _type = 'string'
        }
        return _type
      })
      // 超链接禁止包含在 `` 中
      allowValue = allowValue.join(' \| ')

      // 不是结构体则枚举所有类型
      if (allowValue.includes('](#')) {
        type = allowValue
        allowValue = ''
      } else {
        type = allowValue
        allowValue = ''
      }
    } else {
      type = 'array'
      // console.log(prefix + '.' + field.name, field.type, type, allowValue)
    }
    if (type === 'binary') {
      type = 'string'
    }

    const urlDict = {
      'broker:ssl_client_opts': {
        zh: {
          anchor: '客户端-ssl-tls-配置'
        },
        en: {
          anchor: 'ssl-tls-configuration-for-clients'
        }
      },
      'broker:listener_ssl_opts': {
        zh: {
          anchor: '监听器-ssl-tls-配置'
        },
        en: {
          anchor: 'ssl-tls-configuration-for-the-listener'
        }
      },
    }

    if (type === 'broker:ssl_client_opts') {
      type = `[ssl_client_opts](#${urlDict[type][lang].anchor})`
    } else if (type === 'broker:listener_ssl_opts') {
      type = `[listener_ssl_opts](#${urlDict[type][lang].anchor})`
    } else if (
      [
        'broker:deflate_opts', 'broker:tcp_opts',
        'broker:ws_opts', 'broker:listener_wss_opts'].includes(type)
      /**type.match(/.+:.+/)**/
    ) {
      // TODO 所有的页内选项加上超链接
      const [_, name] = type.split(':')
      type = `[${type}](#${name})`
      // @broker:deflate_opts@
      // @broker:tcp_opts@
      // @broker:ws_opts@

    }
    // 配置项 类型 默认值 可选值 说明
    const _desc = desc ? desc.replace(/\\n/gim, '<br/>') : ''
    body.push(`| ${name} | ${type} | ${defaultValue || ''} | ${allowValue || ''} | ${_desc} |`)

    datalist.push({
      name,
      type,
      defaultValue,
      allowValue: allowValue || '',
      desc: desc || ''
    })

    const mdType = type.includes('](#') ? type : `\`${type}\``
    // markdown 文档
    if (prefix.startsWith('broker:')) {
      prefix = prefix.replace('broker:', '')
    }
    if (s.paths.length === 1) {
      prefix = s.paths[0]
    }

    const mdDict = {
      zh: {
        type: '类型',
        defaultValue: '默认值',
        optionalValue: '可选值'
      },
      en: {
        type: 'Type',
        defaultValue: 'Default',
        optionalValue: 'Optional'
      }
    }

    mdd = mdDict[lang]
    md.push(`**${prefix ? prefix + '.' + name : name}**

  *${mdd.type}*: ${mdType}
${defaultValue ? `\n  *${mdd.defaultValue}*: \`${defaultValue}\`\n` : ''}${allowValue ? `\n  *${mdd.optionalValue}*: ${allowValue}\n` : ''}${desc ? `\n  ${desc}\n` : ''}
`)
  })
  const tb = header + '\n' + body.join('\n')

  const subConfigTitle = `### ${prefix}

${s.desc}

\n\n`

  return {
    tb,
    md: md.join('\n'),
    subConfigTitle,
    datalist,
    prefix
  }
}

function main(edition = 'ce', lang = 'zh') {
  const schema = require(`./schema-${edition}-${lang}.json`)
  const fullNameList = schema.map($ => $.full_name)
  // 转换 schema 为易索引和处理的数据
  const data = {}
  const list = []
  schema.forEach(s => {
    const { full_name, fields } = s
    if (full_name === 'Root Config Keys') return
    const prefix = `${full_name}`
    const schemaData = fields2data(s.fields, prefix, s, edition, lang)

    s.tb = schemaData.tb
    s.md = schemaData.md
    s.prefix = schemaData.prefix
    s.datalist = schemaData.datalist

    data[full_name] = s
    list.push(s)
  })
  // fs.writeFileSync('./model.md', '```\n' + JSON.stringify(Object.keys(data), null, 2) + '\n```')
  // fs.writeFileSync('./model-ee.md', '```\n' + JSON.stringify(Object.keys(data), null, 2) + '\n```')
  // const tb = list.map($ => $.md)
  // fs.writeFileSync('./tb.md', tb.join('\n\n'))
  generateTpl(data, edition, lang)
}

function generateTpl(data, edition = 'ce', lang = 'zh') {
  const tpl = fs.readFileSync(path.join(__dirname, `./cfg.tpl-${lang}.md`)).toString()
  // 找出所有的 @xx@ 标签并执行替换
  let result = tpl.replace(
    /@(.+)@/g,
    (match, full_name) => {
      const [name, descFlag = 'has_desc', prefix = ''] = full_name.split('##')
      let d = data[name]
      if (!d) {
        console.error(full_name + ' not found')
        // throw new Error(full_name + ' not found')
        return ''
      }
      if (prefix) {
        function escapeRegExp(str) {
          return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
        const dPrefix = escapeRegExp(d.prefix)
        d.md = d.md.replace(new RegExp(dPrefix, 'gim'), prefix)
        console.log('replace prefix:', `${d.prefix} --> ${prefix}`)
      }
      if (descFlag === 'no_desc') {
        return d.md
      } else {
        return `\n${d.desc}\n\n${d.md}`
      }
    }
  );
  // console.log(result)
  const fileName = `./x-cfg-${edition}-${lang}.md`

  // 这些 tag 会导致 Vuepress 报错，转义处理
  // fs.writeFileSync('tag.json', JSON.stringify([...new Set(c.match(/<\w+>/g))]))
  const unSafeTags = [
    "<name>",
    "<host>",
    "<node_name>",
    "<Node>",
    "<prefix>",
    "<node>",
    "<ClientID>",
    "<Username>",
    "<clientid>",
    "<event>",
  ]
  unSafeTags.forEach(tag => {
    // result = result.replace(new RegExp(tag, 'gim'), "\\" + tag)
  })

  fs.writeFileSync(fileName, result)
  console.log(`output to ${fileName} success`)
}


// 从命令行中接受 2 个参数分别是版本和语言
const edition = process.argv[2] || 'ce'
const lang = process.argv[3] || 'zh'
// 校验版本和语言是否是 ce/ee 和 zh/en
if (!['ce', 'ee'].includes(edition)) {
  console.error('edition must be ce or ee')
  process.exit(1)
}
if (!['zh', 'en'].includes(lang)) {
  console.error('lang must be zh or en')
  process.exit(1)
}
console.log('start generate config doc for:', edition, lang)

main(edition, lang)


// node.js 追加写入 xxx 到 yyy 文件


// 将本次操作以 log 的形式追加到 log.md 中
fs.writeFileSync('./log.md', `${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} - ${edition} ${lang} - x-cfg-${edition}-${lang}.md`)
console.log('generate config doc success', `x-cfg-${edition}-${lang}.md`)


/**
cp x-cfg-ce-zh.md ~/docs/emqx-refactor/zh_CN/admin/cfg-ce.md
cp x-cfg-ce-en.md ~/docs/emqx-refactor/en_US/admin/cfg-ce.md
cp x-cfg-ee-zh.md ~/docs/emqx-refactor/zh_CN/admin/cfg-ee.md
cp x-cfg-ee-en.md ~/docs/emqx-refactor/en_US/admin/cfg-ee.md
 */