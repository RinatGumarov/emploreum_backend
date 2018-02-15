app = require("./core/app");


//подключение тестового модуля
require("./modules/file/module");
require("./modules/specialisation/module");
require("./modules/employee/module");
require("./modules/auth/module");
require("./modules/company/module");
require("./modules/blockchain/module");
require("./modules/message/module");
//запуск приложения
app.start();
