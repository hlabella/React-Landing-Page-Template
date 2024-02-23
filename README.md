# COBRA AI


amplify.yml:

version: 1
frontend:
  phases:
    preBuild:
      commands:
        - yarn install --ignore-engines
    build:
      commands:
        - yarn run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*