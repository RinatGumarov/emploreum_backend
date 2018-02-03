app = require("./core/app");


//подключение тестового модуля
require("./modules/testModule/module");
require("./modules/login/module");
//запуск приложения
app.start();
