---
title: Supported resource kinds
description: The Kubernetes resource kinds Kubermeister lists and shows detail for, from workloads and networking to RBAC, storage, policy and admission.
sidebar:
  order: 5
---

Every kind below has a list screen and a detail screen. Custom resources are handled separately — see
[custom resources](/docs/browse/custom-resources/).

## Workloads

Pods, Deployments, ReplicaSets, ReplicationControllers, StatefulSets, DaemonSets, Jobs, CronJobs,
HorizontalPodAutoscalers.

ReplicaSets and ReplicationControllers list as their own kinds, each row naming the controller above
it — the only way to tell two rollouts of one deployment apart.

## Configuration

ConfigMaps, Secrets, ResourceQuotas, LimitRanges, PriorityClasses, RuntimeClasses, Leases.

Quotas and limit ranges flatten to one row per resource, rather than one row per object with a
nested table.

## Networking

Services, Ingresses, IngressClasses, NetworkPolicies, Endpoints.

## Storage

PersistentVolumes, PersistentVolumeClaims, StorageClasses, VolumeSnapshots, CSIDrivers, CSINodes,
CSIStorageCapacity.

A CSIDriver's `attachRequired` defaults to **true** when unset, unlike its other flags — so an
omitted spec does not read as a driver that needs no attach step.

## Access control

ServiceAccounts, Roles, RoleBindings, ClusterRoles, ClusterRoleBindings.

## Policy and admission

PodDisruptionBudgets, ValidatingWebhookConfigurations, MutatingWebhookConfigurations,
ValidatingAdmissionPolicies, APIServices, FlowSchemas.

A webhook configuration reads **Blocking** when any of its webhooks fails closed — which is the API's
own default when `failurePolicy` is unset — because such a configuration is a dependency of writing
at all. An unavailable APIService explains why a whole API group's kinds have vanished.

A PodDisruptionBudget allowing no disruption reads **Blocked**, since a drain stops on it and no
count says so on its own.

## Cluster

Nodes, Namespaces, Events, CustomResourceDefinitions.

Namespaces and Nodes are also manifest kinds, so they can be read, created and deleted through the
ordinary write path — and both ask you to type the name before deleting.

## Helm

Releases and their revisions. See [Helm releases](/docs/operations/helm/).
