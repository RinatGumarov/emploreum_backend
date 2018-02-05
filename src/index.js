app = require("./core/app");


//подключение тестового модуля
require("./modules/specialisation/module");
require("./modules/employe/module");
require("./modules/auth/module");
//запуск приложения
app.start();
