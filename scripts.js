const Modal = {
    //Abre e fecha a caixa para adicionara item
    open(){
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')
    },
    close(){
        document
        .querySelector('.modal-overlay')
        .classList
        .remove('active')
    }
}

const Transaction = {
    all: [
        {
            id: 1,
            description: 'Luz',
            amount: - 50000,
            date: '23/01/2021',
        },
        {
            id:2,
            description: 'Website',
            amount: 500000,
            date: '23/01/2021',
        },
        {
            id:3,
            description: 'Internet',
            amount: - 20000,
            date: '23/01/2021',
        },
    ],
    add(transaction){
        //Vai adicionara a trancição na tabela
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index){
        //Vai remover a transação da tabela
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        //Variavel de controle
        let income = 0;

        //Vai fazer o ForEach para ver se cada transação e positiva ou negativa
        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount;
            }
        })
        //Retornar o icome com essa validação
        return income;
    },
    expense() {
        //variavel de controle
        let expense = 0;

        //Varifica se é negativo e adicona em expense
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount;
            }
        })
        //Retorna o resultado que for negarivo
        return expense;
    },
    total() {
        //Faz a conta do que é positivo e negativo
        return Transaction.incomes() + Transaction.expense()
    }
}

const DOM = {
    //Procura seleciona e garda o local da tbody
    transactionsConteine: document.querySelector('#data-table tbody'),

    
    addTransaction(transaction, index){ 
        //Cria um elemento tr
        const tr = document.createElement('tr')
        //vai adicionar na tr o HTML de transation
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        //Vai adicionar no HTML a tr junto com a transation
        DOM.transactionsConteine.appendChild(tr)

    },
    innerHTMLTransaction(transaction){
        //Vai identificar se a transaction e negativa ou positiva
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        //Vai formatar o valor do transaction e passar o amout do transaction
        const amount = Utils.formatCurrency(transaction.amount)

        //Gera o HTML da nova transição
        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img src="./minus.svg" alt="Remover transacao">
        </td>
        `
        //retorna o HTML fa transição
        return html
    },

    updateBalence(){
        //encontra o local que esta o resultado de entrada "incomeDisplay"
        //e atualiza o valor
        document.getElementById('incomeDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.incomes())

        //encontra o local que esta o resultado de entrada "expenseDisplay"
        //e atualiza o valor
        document.getElementById('expenseDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.expense())

        //encontra o local que esta o resultado de entrada "totalDisplay"
        //e atualiza o valor
        document.getElementById('totalDisplay')
        .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        //Vai limpar todas as Transações antigas
        DOM.transactionsConteine.innerHTML = " "
    }
}

const Utils = {
    formatAmount(value){
        value = Number(value) * 100
        return value
    },

    formatDate(date){
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL"
        })
        return signal + value
    }
}

const Form = {
    //Vai procurar e selecionar o que foi colocado na descrição
    description: document.querySelector('input#description'),
    //Vai procurar e selecionar o valor escolhido
    amount: document.querySelector('input#amont'),
    //Vai procurar e selecionar a data escolida
    date: document.querySelector('input#date'),

    getValues() {
        // vai pegar os HTML e retornar como valor
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    validateFields(){
        //Pega os dados do imput que foram tranformados em valor e coloca em variaveis
        const { description, amount, date } = Form.getValues()

        //Verifica se todos os lugares foram prenchidos e se não tiver sido aparece um alert
        if( description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "" ) {
                throw new Error("Faltou algo!!")
            }
    },

    formatValues(){
        //Pega os dados do imput que foram tranformados em valor e coloca em variaveis
        let { description, amount, date } = Form.getValues()

        //Vai na função Utils e vai formatar o amount 
        amount = Utils.formatAmount(amount)

        //Vai na função Utils e vai formatar a date 
        date = Utils.formatDate(date)

        //Vai retornar os lavores retornados
        return {
            description,
            amount,
            date
        }
    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event) {
        //Vai tirar o Default do resultado quando vc envia um formulario
        event.preventDefault()

        //Try e para tentar algo e se nao der certo vai executar o catch
        try {
            //Valida os dados
            Form.validateFields()
            
            //Garda numa variavel os valores colocados no formulario Ja editados
            const transaction = Form.formatValues()

            //Salva a nova Tranação
            Transaction.add(transaction)

            //Limpa os campos
            Form.clearFields()

            //Fecha a aba
            Modal.close()

        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init() {

        Transaction.all.forEach(transaction =>{
            DOM.addTransaction(transaction)
        })
        
        DOM.updateBalence()
        
    },
    reload() {
        DOM.clearTransactions()
        App.init()

    },
}

App.init()