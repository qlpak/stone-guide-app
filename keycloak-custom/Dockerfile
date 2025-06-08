FROM quay.io/keycloak/keycloak:24.0.1
COPY stone-guide-realm.json /opt/keycloak/data/import/
ENTRYPOINT ["/opt/keycloak/bin/kc.sh", "start-dev", "--http-port=8080", "--import-realm"]