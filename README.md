# WEB APP
Init project
1. npm install --legacy-peer-deps

## Cài đặt ESLint
1. npm install eslint@7.11.0 --save-dev

2. npx eslint --init

{
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "plugin:react/recommended",
        "google"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react",
        "@typescript-eslint"
    ],
    "rules": {
        "require-jsdoc": "off",
        "linebreak-style": [
            "error",
            "windows"
        ],
        "indent": "off",
        "max-len": "off",
        "arrow-parens": "off",
        "operator-linebreak": [
            "error",
            "before"
        ],
        "padded-blocks": "off",
        "camelcase": "off",
        "object-curly-spacing": "off",
        "comma-dangle": "off",
        "new-cap": "off",
        "one-var": "off",
        "curly": [
            "error",
            "multi-line"
        ],
        "guard-for-in": "off",
        "no-invalid-this": "off"
    }
}

## Chạy chương trình
###    `npm run start`
## Dependencies
    npm i webpack webpack-cli --save-dev
    npm i @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
    npm i css-loader style-loader --save-dev
    npm i dotenv-webpack
    npm i clean-webpack-plugin
    npm i compression-webpack-plugin
    npm i webpack-bundle-analyzer
    npm i ts-loader
    npm i webpack-dev-server
    npm install eslint --save-dev 
    npm i bootstrap
    npm i react-jhipster reactstrap react-hook-form dayjs
    npm i primeicons primereact
    npm i react-router-dom
    npm i redux react-redux
    npm i axios
    npm i react-hot-loader
    npm i redux-promise-middleware redux-thunk
    npm i immutability-helper
    npm i crypto-js
    npm i react-toastify
    npm i formik
    npm i yup

## Project structure

## Coding convention
## Ref
