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
        this.expPercentage = -1;
    }

    Expense.prototype.calcPercentage = function (totalInc) {
        if (totalInc > 0) {
            this.expPercentage = parseFloat((this.value / totalInc) * 100);
        } else {
            this.expPercentage = -1;
        }
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
        var dataItem;
        if (type === 'inc') {
            dataItem = new Income(id, dataItem.description, dataItem.value);
        } else {
            dataItem = new Expense(id, dataItem.description, dataItem.value);
        }
        data.storage[type].push(dataItem);
        return dataItem;
    }
    return {
        addDataItem: function (dataItem) {
            return addItem(dataItem);
        },
        removeDataItem: function (type, id) {
            var ids = data.storage[type].map(function (current) {
                return current.id;
            })
            var index = parseInt(ids.indexOf(parseInt(id)));
            data.storage[type].splice(index, 1);
        },
        calculateBudget: function () {
            var incTotal, expTotal, percentage;
            incTotal = 0;
            data.storage.inc.forEach(function (inc) {
                incTotal += inc.value;
            });
            expTotal = 0;
            data.storage.exp.forEach(function (exp) {
                expTotal += exp.value;
            });
            data.totals.inc = incTotal;
            data.totals.exp = expTotal;
            if (incTotal > 0) {
                percentage = Math.floor((expTotal / incTotal * 100))
            } else {
                percentage = -1;
            }
            return {
                budget: (incTotal - expTotal),
                income: incTotal,
                expnses: expTotal,
                expensesPercentage: percentage
            }
        },
        calculatePercentage: function () {
            var returnArray = data.storage['exp'].map(function (current) {
                current.calcPercentage(data.totals.inc);
                return {
                    id: current.id,
                    expPercentage: current.expPercentage
                }
            })
            return returnArray;
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
        typeLabel: '.add__type',
        itemPercentageLabel: '.item__percentage'
    }

    var forEachNode = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i, list)
        }
    }

    var displayItem = function (type, dataItem) {
        var html, element;
        if (type === 'inc') {
            html = ' <div class="item clearfix" id="inc-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            element = document.querySelector(DOMConstants.incomeList);
        } else {
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%desc%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            element = document.querySelector(DOMConstants.expenseList);
        }
        html = html.replace("%value%", dataItem.value).replace("%desc%", dataItem.description).replace("%id%", dataItem.id)
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
        addDisplayItem: function (type, dataItem) {
            displayItem(type, dataItem);
        },
        resetInputSection: function () {
            document.querySelector(DOMConstants.desc).focus();
            document.querySelector(DOMConstants.desc).value = "";
            document.querySelector(DOMConstants.value).value = "";
        },
        updateBudget: function (budget) {
            document.querySelector(DOMConstants.budgetLable).textContent = budget.budget;
            document.querySelector(DOMConstants.budgetIncomeLable).textContent = budget.income;
            document.querySelector(DOMConstants.budgetExpenseLable).textContent = budget.expnses;
            if (budget.expensesPercentage === -1) {
                document.querySelector(DOMConstants.budgetExpensesPercentageLable).textContent = "---";
            } else {
                document.querySelector(DOMConstants.budgetExpensesPercentageLable).textContent = budget.expensesPercentage + " %";
            }
        },
        changeType: function () {
            var domNodes = document.querySelectorAll(DOMConstants.value + "," + DOMConstants.desc + "," + DOMConstants.typeLabel);
            forEachNode(domNodes, function (current) {
                current.classList.toggle('red-focus');
            });
            document.querySelector(DOMConstants.addButton).classList.toggle("red");
        },
        updatePercentages: function (percentages) {
            percentages.forEach(function (current) {
                var node = document.getElementById('exp-' + current.id).textContent;
                node.querySelector(DOMConstants.itemPercentageLabel).textContent = current.expPercentage;
            })

        }
    }
})();
var appController = (function (dataController, uiController) {
    var appInit = function () {
        console.log('Application Initalized');
        addEventHandlers();
        uiController.updateBudget({
            budget: 0,
            income: 0,
            expnses: 0,
            expensesPercentage: -1
        });
    }
    var addEventHandlers = function () {
        var DOMStrings = uiController.DOMStrings;
        document.querySelector(DOMStrings.addButton).addEventListener('click', addNewEntry);
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                addNewEntry();
            }
        });
        document.addEventListener('click', cntrlDelete);
        document.querySelector(DOMStrings.typeLabel).addEventListener('change', function () {
            uiController.changeType();
        })
    }
    var cntrlDelete = function (event) {
        //console.log(event.target)
        if (event.target.className === "ion-ios-close-outline") {
            var el = event.target.parentNode.parentNode.parentNode.parentNode;
            el.parentNode.removeChild(el);
            var splitId = el.id.split("-");
            dataController.removeDataItem(splitId[0], splitId[1]);
            var budget = dataController.calculateBudget();
            uiController.updateBudget(budget);

            //Calculate Percentage
            var percentages = dataController.calculatePercentage();

            //Update Percentage
            uiController.updatePercentages(percentages);
        }
    }
    var addNewEntry = function () {
        // get input from UI
        var input = uiController.getInput();
        if (input.description != "" && input.value > 0) {
            // save in data controller
            var dataItem = dataController.addDataItem(input);
            //reset input view
            uiController.resetInputSection();
            // Add item on UI
            uiController.addDisplayItem(input.type, dataItem);
            // update budget
            var budget = dataController.calculateBudget();
            //Update budget on UI
            uiController.updateBudget(budget);

            //Calculate Percentage
            var percentages = dataController.calculatePercentage();

            //Update Percentage
            uiController.updatePercentages(percentages);
        }
    }
    return {
        init: function () {
            appInit();
        }
    }
})(dataController, uiController);
appController.init();
