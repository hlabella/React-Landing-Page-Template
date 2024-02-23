# COBRA AI


amplify.yml:

version: 1
frontend:
  phases:
    preBuild:
      commands:
        - nvm install 18 
        - nvm use 18 
        - yarn install
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