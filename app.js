var dataController = (function () {


    var data = {
        storage: {
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
    }

    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;

    }

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }
    var addItem = function (dataItem) {
        var type, id;
        type = dataItem.type;
        if (data.storage[type].length > 0) {
            id = data.storage[type][data.storage[type].length - 1].id + 1;
        } else {
            id = 0;
        }

        data.storage[type];
        data.storage[type].push(type === 'inc' ? new Income(id, dataItem.description, dataItem.value) : new Expense(id, dataItem.description, dataItem.value));

    }

    return {
        addDataItem: function (dataItem) {
            addItem(dataItem);
        },
        calculateBudget: function () {
            var incTotal, expTotal;
            incTotal = 0;
            data.storage.inc.forEach(function (inc) {
                incTotal += inc;
            });

            expTotal = 0;
            data.storage.exp.forEach(function (exp) {
                expTotal += exp;
            });

            data.totals.inc = incTotal;
            data.totals.exp = expTotal;
        },
        testing: function () {
            console.log(data);
        }
    }
})();

var uiController = (function () {


    var DOMConstants = {
        addButton: '.add__btn',
        type: '.add__type',
        desc: '.add__description',
        value: '.add__value',
        incomeList: '.income__list',
        expenseList: '.expenses__list',
        budgetLable: '.budget__value',
        budgetIncomeLable: '.budget__income--value',
        budgetExpenseLable: '.budget__expenses--value',
        budgetExpensesPercentageLable: '.budget__expenses--percentage',

    }
    var displayItem = function (dataItem) {
        var html, element;

        if (dataItem.type === 'inc') {
            html = ' <div class="item clearfix" id="income-0"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            element = document.querySelector(DOMConstants.incomeList);
        } else {
            html = '<div class="item clearfix" id="expense-0"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            element = document.querySelector(DOMConstants.expenseList);
        }

        html = html.replace("%value%", dataItem.value).replace("%desc%", dataItem.description);
        element.insertAdjacentHTML('beforeend', html);
    }
    return {
        DOMStrings: DOMConstants,
        getInput: function () {
            return {
                type: document.querySelector(DOMConstants.type).value,
                description: document.querySelector(DOMConstants.desc).value,
                value: parseFloat(document.querySelector(DOMConstants.value).value),
            }
        },
        addDisplayItem: function (dataItem) {
            displayItem(dataItem);
        },
        resetInputSection: function () {
            document.querySelector(DOMConstants.desc).focus();
            document.querySelector(DOMConstants.desc).value = "";
            document.querySelector(DOMConstants.value).value = "";
        },
        clearBuget: function () {
            document.querySelector(DOMConstants.budgetLable).textContent = 0;
            document.querySelector(DOMConstants.budgetIncomeLable).textContent = 0;
            document.querySelector(DOMConstants.budgetExpenseLable).textContent = 0;
            document.querySelector(DOMConstants.budgetExpensesPercentageLable).textContent = 0;
        }

    }
})();


var appController = (function (dataController, uiController) {

    var appInit = function () {
        console.log('Application Initalized');
        addEventHandlers();
        uiController.clearBuget();
    }
    var addEventHandlers = function () {

        var DOMStrings = uiController.DOMStrings;
        document.querySelector(DOMStrings.addButton).addEventListener('click', addNewEntry);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                addNewEntry();
            }
        })

    }

    var addNewEntry = function () {
        // get input from UI
        var input = uiController.getInput();

        if (input.description != "" && input.value > 0) {
            // save in data controller
            dataController.addDataItem(input);

            //reset input view
            uiController.resetInputSection();

            // display in UI controller
            uiController.addDisplayItem(input);

            // update budget
            dataController.calculateBudget();
        }
    }

    return {
        init: function () {
            appInit();
        }
    }
})(dataController, uiController);
appController.init();
