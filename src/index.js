app = require("./core/app");


require("./modules/file/module");
require("./modules/specialisation/module");
require("./modules/employee/module");
require("./modules/auth/module");
require("./modules/company/module");
require("./modules/message/module");
require("./modules/work/module");
require("./modules/test/module");
//запуск приложения
app.start();
