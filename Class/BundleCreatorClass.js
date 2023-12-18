/**
 * @description Bundle Creator para auxiliar no desenvolvimento de ferramentas Crawler.
 * @author      Nicolas Popovicz <nicolas.p@procob.com>
 * @version     1.0
 * @example
 *
 * const BundleCreatorClass = require("./Class/BundleCreatorClass");
 *
 * BundleCreatorClass.createBundle();
 *
 * Para utilizar o bundle da maneira correta pelo prompt, digite o seguinte trecho
 *
 * node index.js <nome-do-seu-bundle>
 */
module.exports = new class BundleCreatorClass {
    constructor() {
        this.fs   = require("fs");
        this.exec = require("child_process").exec;
        this.path = require("path");

        this.directoriesBundle = ["DOM", "Routes", "Helper", "Tests", "Config", "Headers"];

        this.mainDir     = `${this.path.basename("./")}/src`;
        this.apisDir     = `${this.mainDir}/Api`;
        this.crawlersDir = `${this.mainDir}/Crawlers`;
        this.servicesDir = `${this.mainDir}/Services`;

        this.subdirApi = ["Controllers", "Routes"];
    }

    /**
     * Cria o bundle a partir do nome passado pelo parâmetro
     * na linha de comando
     * @returns {void}
     */
    createBundle() {
        let argument = this.checkIfArgumentExists();

        this.checkIfExistsSourceDir();
        this.createMainDirs(argument);

        this.createFileSystemModel(
            this.returnBundleName(argument),
            argument
        );
    }

    /**
     * Verifica se o argumento foi fornecido na linha de comando.
     * @returns {String}
     * @throws  {Error}
     */
    checkIfArgumentExists() {
        this.argument = process.argv[2] ? process.argv[2] : undefined;

        if (typeof this.argument === "undefined") throw new Error("\x1b[31mNão foi fornecido o nome do bundle!\x1b[0m");

        return this.argument;
    }

    /**
     * Verifica se o diretório Source (ou src) existe no projeto.
     * @returns {void}
     * @throws  {Error}
     */
    checkIfExistsSourceDir() {
        if (!this.fs.existsSync(this.mainDir)) throw new Error("\x1b[31mNão foi possível encontrar o diretório raíz /src\x1b[0m");
    }

    /**
     * Retorna o nome do bundle. Caso o mesmo já exista, retorna erro
     * @param   {String} arg
     * @returns {String}
     * @throws  {Error}
     */
    returnBundleName(arg) {
        this.pathDir = `${this.crawlersDir}/${arg}Bundle`;

        if (this.fs.existsSync(this.pathDir)) throw new Error(`\x1b[31mO Bundle com o nome '${arg}' já existe!\x1b[0m`);

        return this.pathDir;
    }

    /**
     * Cria o padrão de dir + file do bundle
     * @param   {String} bundle
     * @param   {String} argument
     * @returns {void}
     */
    createFileSystemModel(bundle, argument) {
        this.fs.mkdirSync(bundle);
        console.log(`\r\n\x1b[35mCriado módulo '${argument}'\x1b[0m\r\n`);

        this.fs.writeFileSync(`${bundle}/${argument}RequestCrawler.js`, this.writeFileModel(argument));
        console.log(`\x1b[34mCriado arquivo '${argument}RequestCrawler.js'\x1b[0m\r\n`);

        this.fs.writeFileSync(`${this.servicesDir}/${argument}Service.js`, this.writeFileModel(argument, "Service"));

        this.directoriesBundle.map(directory => {
            this.fs.mkdirSync(`${bundle}/${directory}`);
            this.fs.writeFileSync(`${bundle}/${directory}/${argument}${directory}.js`, this.writeFileModel(argument, directory));

            console.log(`\x1b[34mCriado subdiretório '${directory}' e arquivo '${argument}${directory}.js'\x1b[0m`);
        });

        this.exec(`chmod o+w ${bundle} -R`);

        console.log("\r\n\x1b[33mPermissões do bundle alteradas!\x1b[0m\r\n");

        console.log("\x1b[32mBundle criado com sucesso! \x1b[0m\r\n");
    }

    /**
     * Caso não existam, cria os diretórios Service, Controller e Api dentro de /src.
     * @param {String} argument
     */
    createMainDirs(argument) {
        if (!this.fs.existsSync(this.apisDir)) {
            this.fs.mkdirSync(this.apisDir);
            console.log(`\r\n\x1b[35mCriado diretório '${this.apisDir}'\x1b[0m`);

            this.exec(`chmod o+w ${this.apisDir} -R`);
        }

        if (this.fs.existsSync(this.apisDir)) {
            this.subdirApi.map(subDir => {
                if (!this.fs.existsSync(`${this.apisDir}/${subDir}`)) {
                    this.fs.mkdirSync(`${this.apisDir}/${subDir}`);
                    console.log(`\x1b[34mCriado subdiretório '${this.apisDir}/${subDir}'\x1b[0m`);
                }

                if (subDir === this.subdirApi[1]) {
                    this.fs.writeFileSync(`${this.apisDir}/${subDir}/${argument}RequestApi.js`, this.writeFileModel(argument, "RequestApi"));
                    console.log(`\x1b[34mCriado arquivo '${this.apisDir}/${subDir}/${argument}RequestApi.js'\x1b[0m`);
                } else {
                    this.fs.writeFileSync(`${this.apisDir}/${subDir}/${argument}${subDir.slice(0, -1)}.js`, this.writeFileModel(argument, subDir));
                    console.log(`\x1b[34mCriado arquivo '${this.apisDir}/${subDir}/${argument}${subDir}.js'\x1b[0m`);
                }
            })

            this.exec(`chmod o+w ${this.apisDir} -R`);
            console.log(`\r\n\x1b[33mPermissões do diretório ${this.apisDir} alteradas!\x1b[0m`);
        }

        if (!this.fs.existsSync(this.crawlersDir)) {
            this.fs.mkdirSync(this.crawlersDir);
            console.log(`\x1b[35mCriado diretório '${this.crawlersDir}'\x1b[0m`);

            this.exec(`chmod o+w ${this.crawlersDir} -R`);
            console.log(`\x1b[33mPermissões do diretório ${this.crawlersDir} alteradas!\x1b[0m\r\n`);
        }

        if (!this.fs.existsSync(this.servicesDir)) {
            this.fs.mkdirSync(this.servicesDir);
            console.log(`\x1b[35mCriado diretório '${this.servicesDir}'\x1b[0m`);

            this.exec(`chmod o+w ${this.servicesDir} -R`);
            console.log(`\x1b[33mPermissões do diretório ${this.servicesDir} alteradas!\x1b[0m`);
        }
    }

    /**
     * Padrão de write file
     * @param   {String} fileName
     * @param   {String} fileType
     * @returns {String}
     */
    writeFileModel(fileName, fileType) {
        this.writeModel  = "";
        this.namePattern = `${fileName.charAt(0).toUpperCase() + fileName.slice(1)}`;

        const listDirBundles = [this.directoriesBundle[0], this.directoriesBundle[4], this.directoriesBundle[5]];

        if (listDirBundles.includes(fileType)) {
            return `module.exports = {};`;
        }

        switch (fileType) {
            case this.directoriesBundle[1]:
                this.writeModel = `module.exports = class ${this.namePattern}Route {};`;
                break;

            case this.directoriesBundle[2]:
                this.writeModel = `module.exports = class ${this.namePattern}Helper {};`;
                break;

            case this.directoriesBundle[3]:
                this.writeModel = `module.exports = class ${this.namePattern}Tests {};`;
                break;

            case "Controllers":
                this.writeModel = `const ${this.namePattern}RequestCrawler = require('../../Crawlers/${fileName}Bundle/${fileName}RequestCrawler');\nconst abstractController = require("./abstractController");\n\nmodule.exports = new class ${this.namePattern}Controller extends abstractController {};`;
                break;

            case "RequestApi":
                this.writeModel = `const ${this.namePattern}Controller = require("../Controllers/${fileName}Controller");\nconst abstractApi = require('./abstractApi');\nconst express = require('express');\nconst router = express.Router();`;
                break;

            case "Service":
                this.writeModel = `module.exports = class ${this.namePattern}Service {};`;
                break;

            default:
                this.writeModel = `module.exports = class ${this.namePattern}RequestCrawler {};`
                break;
        }

        return this.writeModel;
    }
}