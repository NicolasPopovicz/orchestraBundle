/**
 * @description Bundle Creator para auxiliar no desenvolvimento de ferramentas Crawler.
 * @author Nicolas Popovicz <nicolas.p@procob.com>
 * @version 1.0
 * @example
 * const BundleCreatorClass = require("./Class/BundleCreatorClass");
 *
 * (new BundleCreatorClass()).createBundle();
 */
module.exports = class BundleCreatorClass {
    constructor() {
        this.fs   = require("fs");
        this.exec = require("child_process").exec;
        this.path = require("path");

        this.directoriesBundle = ["DOM", "Route", "Helper", "Tests", "Config", "Headers"];
        this.mainDir = this.path.basename("./") + "/src";
    }

    /**
     * Cria o bundle a partir do nome passado pelo parâmetro
     * na linha de comando
     */
    createBundle() {
        this.checkIfExistsSourceDir();

        this.createFileSystemModel(
            this.returnBundleName(this.checkIfArgumentExists()),
            this.checkIfArgumentExists()
        );
    }

    /**
     * Verifica se o argumento foi fornecido na linha de comando.
     * @returns {String}
     */
    checkIfArgumentExists() {
        this.argument = process.argv[2] ? process.argv[2] : undefined;

        if (typeof this.argument === "undefined") throw new Error("\x1b[31mNão foi fornecido o nome do bundle!\x1b[0m");

        return this.argument;
    }

    /**
     * Verifica se o diretório Source (ou src) existe no projeto.
     * @returns {void}
     */
    checkIfExistsSourceDir() {
        if (!this.fs.existsSync(this.mainDir)) throw new Error("\x1b[31mNão foi possível encontrar o diretório raíz /src\x1b[0m");
    }

    /**
     * Retorna o nome do bundle. Caso o mesmo já exista, retorna erro
     * @param {String} arg
     * @returns {String}
     */
    returnBundleName(arg) {
        this.pathDir = `${this.mainDir}/${arg}Bundle`;

        if (this.fs.existsSync(this.pathDir)) throw new Error(`\x1b[31mO Bundle com o nome '${arg}' já existe!\x1b[0m`);

        return this.pathDir;
    }

    /**
     * Cria o padrão de dir + file do bundle
     * @param {String} bundle
     * @param {String} argument
     * @returns {void}
     */
    createFileSystemModel(bundle, argument) {
        this.fs.mkdirSync(bundle);
        console.log(`\r\n\x1b[35mCriado módulo '${argument}'\x1b[0m\r\n`);

        this.fs.writeFileSync(`${bundle}/${argument}RequestCrawler.js`, this.writeFileModel(argument));
        console.log(`\x1b[34mCriado arquivo '${argument}RequestCrawler.js'\x1b[0m\r\n`);

        this.directoriesBundle.map(directory => {
            this.fs.mkdirSync(`${bundle}/${directory}`);
            this.fs.writeFileSync(`${bundle}/${directory}/${argument}${directory}.js`, this.writeFileModel(argument, directory));

            console.log(`\x1b[34mCriado: diretório '${directory}' e arquivo '${argument}${directory}.js'\x1b[0m`);
        });

        this.exec(`chmod o+w ${bundle} -R`);

        console.log("\r\n\x1b[33mPermissões do bundle alteradas!\x1b[0m\r\n");

        console.log("\x1b[32mBundle criado com sucesso! \x1b[0m\r\n");
    }

    /**
     *
     * @param {String} fileName
     * @param {String} fileType
     * @returns {String}
     */
    writeFileModel(fileName, fileType) {
        this.writeModel  = "";
        this.namePattern = `${fileName.charAt(0).toUpperCase() + fileName.slice(1)}`;

        if (fileType === this.directoriesBundle[0] || fileType === this.directoriesBundle[4] || fileType === this.directoriesBundle[5]) {
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

            default:
                this.writeModel = `module.exports = class ${this.namePattern}CrawlerRequest {};`
                break;
        }

        return this.writeModel;
    }
}