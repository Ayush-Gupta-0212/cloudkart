{{/*
  _helpers.tpl — reusable template snippets.
  Called like: {{ include "cloudkart.labels" (dict "name" "user-service" "root" .) }}
*/}}

{{- define "cloudkart.labels" -}}
app: {{ .name }}
app.kubernetes.io/name: {{ .name }}
app.kubernetes.io/instance: {{ .root.Release.Name }}
app.kubernetes.io/managed-by: {{ .root.Release.Service }}
app.kubernetes.io/part-of: cloudkart
helm.sh/chart: {{ printf "%s-%s" .root.Chart.Name .root.Chart.Version }}
{{- end -}}

{{- define "cloudkart.selectorLabels" -}}
app: {{ .name }}
{{- end -}}
