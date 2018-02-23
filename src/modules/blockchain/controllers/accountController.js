const logger = require("../../../utils/logger");
const blockchainRegisterService = require("../../work/utils/account");
const work = require("../../work/utils/work");

const web3 = require("../../work/utils/web3");

module.exports.func = (router) => {
    router.get("/account", (req, res) => {
        // let encryptedAccount = blockchainRegisterService.generateEmployeeAccount("password")
        // let key = {
        //     "version": 3,
        //     "id": "51e90ed3-2957-4c99-8b02-ba36399e2ba4",
        //     "address": "4a474bc1a317f21fcd58f010533cba020443bc1e",
        //     "crypto": {
        //         "ciphertext": "2cb4a8e75a151e7418ffede78d37eb794d18cf86c70082505ef06cf5793131f9",
        //         "cipherparams": {"iv": "9cfaf3b0b154d5639c3b40b9da35f66d"},
        //         "cipher": "aes-128-ctr",
        //         "kdf": "scrypt",
        //         "kdfparams": {
        //             "dklen": 32,
        //             "salt": "af868c00c5ed22cadf1853a076d58b46d3303aaff2b1479682338121edae4d50",
        //             "n": 8192,
        //             "r": 8,
        //             "p": 1
        //         },
        //         "mac": "aa81677d1713f1695f51818803f950087975adaa263f9fe61409258e4e936e61"
        //     }
        // };
        //
        // let decrypted = web3.eth.accounts.decrypt(key, 'password');
        // let privateKey = decrypted.privateKey;
        // let value = web3.utils.toWei('0.0005', 'ether');
        // let to = '0x118E5B7539ceb7d6293388a51a6c3fAbfDD458b4';
        // return blockchainRegisterService.sendTransaction(value, to, privateKey, (data) => {res.json(data)});
    });
    // Address: 0xadd49242A4a1552bBfaB39A804467Fa4D27a7333
    // PK: 0xe5a23b6c28e5983108a59855d5c2d5de104abe207e00a786e5a95f146778eee7
    // work : 0x99c4aA94CDF3eb2f8750F83EC023d7B7699eFFc5


    router.get("/test", (req, res) => {


        return work.getWorkData("0x99c4aA94CDF3eb2f8750F83EC023d7B7699eFFc5").then(() => res.json(0));

        // return work.start("0x99c4aA94CDF3eb2f8750F83EC023d7B7699eFFc5", web3.utils.toWei('0.000001', 'ether'),
        //                   "0xe5a23b6c28e5983108a59855d5c2d5de104abe207e00a786e5a95f146778eee7"
        // ).then(() => res.json(0));


        // var begin = (new Date()).getTime();
        // var address = '0x24959b8bECaCA482225aE24EF0d7b415e1c1c84a';
        // contractLibrary.createContract(contractInfo, gas, [], [], begin, 1716924800,
        //                                '0xF2f757BAE0F8681Da6315cED951b3ac566CB5ED7',
        //                                '0xF54934698F6D4Daa0D6F8354A7599629DBAcb9EE', Math.pow(10, 12)).then(
        // creator.createMainContract().then(contract => {
        //     console.log(contract);
        // })

        // contractLibrary.readContractFromAddress(contractInfo, address).then(contract => {
        //     console.log(contract)
        // contract.newEmployee("_firstName", "_lastName", "_email", 1,
        // '0x002c7E60484a0B65034C5D70b887Eee4A2C0FFbb', [], [], []).then((data) => { console.log(data)
        // console.log('created') }) contract.getEmployee(0).then(data => { console.log('contract data: ', data) })
        // contract.newCompany('company 1', 1, '0x004120f424F83417C68109Cc8522594c22528d3c').then(data => {
        // console.log('contract data: ', data) })
        // contract.getContractStatus().then(data => {
        //     console.log('contract data: ', data.toString())
        //     var end = (new Date()).getTime()
        //     console.log(end - begin);
        // })
        // contract.newContract([], [], 1519827609, 1716924800,
        // '0xF2f757BAE0F8681Da6315cED951b3ac566CB5ED7', '0xF54934698F6D4Daa0D6F8354A7599629DBAcb9EE',
        // Math.pow(10, 12)).then(data => {
        //   console.log('contract data: ', data)
        // })
    });
    return router;
};