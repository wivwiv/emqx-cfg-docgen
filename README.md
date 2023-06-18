# emqx-cfg-docgen

Generate configuration manual from EMQX docgen schema

## Usage

1. Get docgen schema and rename it to `schema-{version}-{lang}.json` from [emqx/emqx Github Action](https://github.com/emqx/emqx/actions/workflows/build_slim_packages.yaml) or [zmstone/emqx-docgen](https://github.com/zmstone/emqx-docgen).

2. Run `node index.js [ce, ee] [en, zh]` to generate configuration manual.

```bash
$ git clone
$ cd emqx-cfg-docgen
node index.js [ce, ee] [en, zh] 
```

