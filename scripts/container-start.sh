#!/bin/sh
# Entry point for this static site only. Keep the previous complete bundle as fallback.
set -eu
mescla_stage=/site/staging
mescla_archive=/site/site.tar.gz.new
mescla_manifest=/site/files.new
mescla_valid=0
mescla_ref="${MESCLA_SITE_REF:-main}"
if wget -q --timeout=30 -O "$mescla_archive" "https://raw.githubusercontent.com/neoari/mescla-lp/$mescla_ref/site.tar.gz"; then
  if tar -tzf "$mescla_archive" > "$mescla_manifest"; then
    mescla_valid=1
    while IFS= read -r mescla_file; do
      case "$mescla_file" in
        index.html|privacidade/index.html|assets/segments.css|assets/measurement.js|assets/measurement-config.js|para/empreendedores/index.html|para/creators/index.html|para/consultorias/index.html|para/agencias/index.html|para/advocacia/index.html) ;;
        *) mescla_valid=0 ;;
      esac
    done < "$mescla_manifest"
  fi
fi
if [ "$mescla_valid" = 1 ]; then
  rm -rf "$mescla_stage"
  mkdir -p "$mescla_stage"
  if tar -xzf "$mescla_archive" -C "$mescla_stage"; then
    for mescla_file in index.html privacidade/index.html assets/segments.css assets/measurement.js assets/measurement-config.js para/empreendedores/index.html para/creators/index.html para/consultorias/index.html para/agencias/index.html para/advocacia/index.html; do
      if [ ! -s "$mescla_stage/$mescla_file" ]; then mescla_valid=0; fi
    done
  else
    mescla_valid=0
  fi
fi
if [ "$mescla_valid" = 1 ]; then
  rm -rf /site/previous
  if [ -d /site/active ]; then mv /site/active /site/previous; fi
  mv "$mescla_stage" /site/active
  mv "$mescla_archive" /site/site.tar.gz
else
  echo 'Mescla: bundle download or validation failed; using cached site.' >&2
fi
rm -f "$mescla_archive" "$mescla_manifest"
# Compatibility with the older single-page deployment on the first migration.
if [ ! -s /site/active/index.html ] && [ -s /site/index.html ]; then
  mkdir -p /site/active
  cp /site/index.html /site/active/index.html
fi
test -s /site/active/index.html
cp -R /site/active/. /usr/share/nginx/html/
exec nginx -g 'daemon off;'
