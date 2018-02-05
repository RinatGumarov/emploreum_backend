app = require("./core/app");


//подключение тестового модуля
require("./modules/testModule/module");
require("./modules/auth/module");
//запуск приложения
app.start();
