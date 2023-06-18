# 配置手册

EMQX 配置文件手册。

## 节点设置

设置节点名称以及 Cookie。每个 Erlang 节点(进程)需指配一个节点名，用于节点间通信互访。 所有互相通信的 Erlang 节点(进程)间通过一个共用的 Cookie 进行安全认证。

@node##no_desc@

## RPC 设置

@rpc@

## 集群设置

@cluster@

## 集群自动发现

EMQX 支持多种策略的节点自动发现与集群，详见 [创建集群](../deploy/cluster/create-cluster.md)。

| 策略   | 说明                    |
| ------ | ----------------------- |
| manual | 手工命令创建集群        |
| static | 静态节点列表自动集群    |
| mcast  | UDP 组播方式自动集群    |
| dns    | DNS A 记录自动集群      |
| etcd   | 通过 etcd 自动集群      |
| k8s    | Kubernetes 服务自动集群 |

### manual 手动创建集群

默认配置为手动创建集群，节点通过 `./bin/emqx_ctl join <Node>` 命令加入:

```bash
cluster.discovery = manual
```

### 基于 static 节点列表自动集群

@cluster_static@

### 基于 DNS 记录自动集群

@cluster_dns@

### 基于 etcd 自动集群

@cluster_etcd@

### 基于 Kubernetes 自动集群

@cluster_k8s@

## 日志参数

配置日志输出位置、日志级别、日志文件存储路径以及日志轮换、过载保护等参数。

### 文件输出日志

@log_file_handler@

### Console 输出日志

@console_handler@

<!-- ### 日志轮换

log_rotation
-->

<!-- ### 日志突发限制

log_burst_limit -->

<!-- ### 日志过载终止

log_overload_kill -->

## MQTT/TCP 监听器 - 1883

EMQX 支持配置多个监听器，默认 MQTT/TCP 监听器端口为 `1883`。

@broker:mqtt_tcp_listener##no_desc@

## MQTT/SSL 监听器 - 8883

@broker:mqtt_ssl_listener@

## MQTT Over QUIC/UDP 监听器 - 14567

设置 MQTT over QUIC UDP 监听器，该监听器默认不启用且在某些操作系统中不可用，详情请参考 [MQTT over QUIC 快速开始](../mqtt-over-quic/getting-started.md)

@broker:mqtt_quic_listener##node_desc@

## MQTT/WebSocket 监听器 - 8083

@broker:mqtt_ws_listener@

## MQTT/WebSocket with SSL 监听器 - 8084

@broker:mqtt_wss_listener@

## MQTT 基本参数

全局的 MQTT 配置参数。

@broker:mqtt@

<!-- TODO zone 的处理 -->

<!-- #topology# -->

### 保留消息

@retainer@

<!-- retainer:flow_control -->

@retainer:mnesia_config@

### 共享订阅

是否启用共享订阅可通过 `mqtt.shared_subscription` 或 `zone.$name.shared_subscription` 配置项配置。

<!-- broker:shared_subscription_group@ -->

### 系统主题

@broker:sys_topics@

## MQTT 扩展功能

### 延迟发布

@modules:delayed@

<!-- ### 主题重写

modules:rewrite@ -->

<!-- ### 代理订阅

auto_subscribe@

auto_subscribe:topic@ -->

<!-- ## 日志追踪

broker:trace@ -->

## 集成 Prometheus

@prometheus@

<!-- ## 集成 StatsD

statsd@ -->

## 慢订阅

慢订阅消息延迟阈值与统计策略配置。

@slow_subs##no_desc@

<!-- ## 主题统计

配置需要统计详细消息流转数据的主题。

modules:topic_metrics@ -->

## 告警与监控

@broker:alarm@

### 告警阈值

<!-- #broker:sysmon# -->

@broker:sysmon_os@

<!-- broker:sysmon_top@ -->

@broker:sysmon_vm@

## 速率限制

有关速率限制的介绍以及使用请参考 [速率限制](../rate-limit/rate-limit.md)。

<!-- ## 过载保护

broker:overload_protection@ -->

## 性能优化

<!-- ### broker_perf

broker:broker_perf@ -->

### force_gc

@broker:force_gc@

### force_shutdown

@broker:force_shutdown@

<!-- ### conn_congestion

broker:conn_congestion@ -->

### flapping_detect

@broker:flapping_detect@

<!-- ### stats 统计

broker:stats@ -->

<!-- {% emqxce %} -->

<!-- ## 遥测 -->

<!-- modules:telemetry@ -->

<!-- {% endemqxce %} -->

<!-- ## zone 配置 -->

<!-- #zone:overload_protection# -->

## Dashboard

@dashboard@

@dashboard:http@

@dashboard:https@

@dashboard:listeners@

## API 密钥

@api_key@

## 事件主题

@broker:event_names@

## 数据桥接

### MQTT

@bridge_mqtt:config@

@bridge_mqtt:creation_opts@

### WebHook

@bridge_webhook:config@

@bridge_webhook:creation_opts@

### 连接配置

@connector-http:request@

@connector-mqtt:egress@

@connector-mqtt:egress_local@

@connector-mqtt:egress_remote@

@connector-mqtt:ingress@

@connector-mqtt:ingress_local@

@connector-mqtt:ingress_remote@

## 插件

@plugin:plugins@

@plugin:state@

## ExHook 多语言钩子

@exhook@

@exhook:server@

@exhook:socket_options@

@exhook:ssl_conf@

## 附录

### 客户端 SSL/TLS 配置

@broker:ssl_client_opts@

### 监听器 SSL/TLS 配置

@broker:listener_ssl_opts@

### tcp_opts

@broker:tcp_opts@

### ws_opts

@broker:ws_opts@

### listener_wss_opts

@broker:listener_wss_opts@

### deflate_opts

@broker:deflate_opts@