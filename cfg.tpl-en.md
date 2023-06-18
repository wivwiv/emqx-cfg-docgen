# Configuration Manual

EMQX Configuration File Manual.

## Node and Cookie

The Erlang/OTP platform application is composed of distributed Erlang nodes (processes). Each Erlang node (process) needs to be assigned a node name for mutual communication between nodes. All Erlang nodes (processes) in communication are authenticated by a shared cookie.

@node##no_desc@

## RPC

@rpc@

## Cluster Setup

@cluster@

## Cluster Autodiscovery

EMQX supports node discovery and autocluster with various strategies:
see [Create and manage clusters](../deploy/cluster/create-cluster.md)。

| Strategy | Description                     |
| -------- | ------------------------------- |
| manual   | Create cluster manually         |
| static   | Autocluster by static node list |
| mcast    | Autocluster by UDP Multicast    |
| dns      | Autocluster by DNS A Record     |
| etcd     | Autocluster using etcd          |
| k8s      | Autocluster on Kubernetes       |

### Create cluster manually

This is the default configuration of clustering, nodes join a cluster by executing ./bin/emqx_ctl join <Node> CLI command:

```bash
cluster.discovery = manual
```

### Autocluster by static node list

@cluster_static@

### Autocluster by DNS Record

@cluster_dns@

### Autocluster using etcd

@cluster_etcd@

### Autocluster on Kubernetes

@cluster_k8s@

## Log

Configure the log output location, log level, log file storage path, and parameters such as log rotation and overload protection.

### File Output Log

@log_file_handler@

### Console Output Log

@console_handler@

<!-- ### Log rotation

log_rotation

 -->

<!-- ### Log burst limit

log_burst_limit -->

<!-- ### Log overload kill

log_overload_kill -->

## MQTT/TCP Listener - 1883

EMQX supports the creation of multiple listeners, and the default MQTT/TCP listener port is `1883`.

@broker:mqtt_tcp_listener##no_desc@

## MQTT/SSL Listener - 8883

@broker:mqtt_ssl_listener@

## MQTT Over QUIC/UDP Listener - 14567

Set the MQTT over QUIC UDP listener, which is not enabled by default. And this feature is not available in some operating systems.

For details, please refer to [MQTT over QUIC Quick Start](../mqtt-over-quic/getting-started.md).

@broker:mqtt_quic_listener##node_desc@

## MQTT/WebSocket Listener - 8083

@broker:mqtt_ws_listener@

## MQTT/WebSocket with SSL Listener - 8084

@broker:mqtt_wss_listener@

## MQTT Basic Parameters

Global MQTT configuration parameters.

@broker:mqtt@

<!-- TODO zone 的处理 -->

<!-- #topology# -->

### Retainer

@retainer@

<!-- retainer:flow_control -->

@retainer:mnesia_config@

### Shared subscription

You can set to enable or disable shared subscription configuration via `mqtt.shared_subscription` or `zone.$name.shared_subscription` item.

<!-- broker:shared_subscription_group@ -->

### System topics

@broker:sys_topics@

## MQTT Adds-on

### Delayed publish

@modules:delayed@

<!-- ### Topic rewrite

modules:rewrite@ -->

<!-- ### Auto subscribe

auto_subscribe@

auto_subscribe:topic@ -->

<!-- ## Log Trace

broker:trace@ -->

## Integration With Prometheus

@prometheus@

<!-- ## Integration with StatsD

statsd@ -->

## Slow subscriptions

Slow subscription message latency threshold and statistics policy configuration.

@slow_subs##no_desc@

<!-- ## Topic metrics

Configure the topics that require statistics for detailed message flow data.

modules:topic_metrics@ -->

## Alarms and Monitoring

@broker:alarm@

### Alarm Threshold

<!-- #broker:sysmon# -->

@broker:sysmon_os@

<!-- broker:sysmon_top@ -->

@broker:sysmon_vm@

## Rate Limit

For an introduction to rate limiting and its use, please refer to [rate limiting](../rate-limit/rate-limit.md).

<!-- ## Overload Protection

broker:overload_protection@ -->

## Performance optimization

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

<!-- ### stats

broker:stats@ -->

<!-- {% emqxce %} -->

<!-- ## Telemetry -->

<!-- modules:telemetry@ -->

<!-- {% endemqxce %} -->

<!-- ## zone 配置 -->

<!-- #zone:overload_protection# -->

## Dashboard

@dashboard@

@dashboard:http@

@dashboard:https@

@dashboard:listeners@

## API Keys

@api_key@

## Events Topic

@broker:event_names@

## Data Bridge

### MQTT

@bridge_mqtt:config@

@bridge_mqtt:creation_opts@

### WebHook

@bridge_webhook:config@

@bridge_webhook:creation_opts@

### Data Bridge Connector

@connector-http:request@

@connector-mqtt:egress@

@connector-mqtt:egress_local@

@connector-mqtt:egress_remote@

@connector-mqtt:ingress@

@connector-mqtt:ingress_local@

@connector-mqtt:ingress_remote@

## Plugin

@plugin:plugins@

@plugin:state@

## ExHook

@exhook@

@exhook:server@

@exhook:socket_options@

@exhook:ssl_conf@

## Others

### SSL/TLS configuration for clients

@broker:ssl_client_opts@

### SSL/TLS configuration for the listener

@broker:listener_ssl_opts@

### tcp_opts

@broker:tcp_opts@

### ws_opts

@broker:ws_opts@

### listener_wss_opts

@broker:listener_wss_opts@

### deflate_opts

@broker:deflate_opts@
