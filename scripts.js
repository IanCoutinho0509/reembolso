//selecionando elementos do formulario
const formulario = document.querySelector("form") //pra pegar quando for submetido
const valorDespesa = document.querySelector("#amount")
const nomeDespesa = document.querySelector("#expense")
const categoria = document.querySelector("#category")

//selecionando elementos da lista
const listaDespesas = document.querySelector("ul")

//selecionando totais
const quantidadeDespesas = document.querySelector("aside header p span")//no aside dentro do header...
const totalDespesa = document.querySelector("aside header h2")

 //input é um evento disparado quando um valor no campo input muda e eu quero mudar ele pra aparecer so numero
valorDespesa.addEventListener("input", () => {
    let value = valorDespesa.value.replace(/\D/g,"") //tudo que nao for numero eu nao vou pegar no value

    //
    value = Number(value) / 100 //Divide por 100: Isso faz com que o usuário possa digitar centavos corretamente (ex: digitar 1234 vira 12,34).

    valorDespesa.value = formatandoValorBRL(value) //como o valor da variavel valorDespesa é igual ao value e eu estou dentro do evento input quando a pessoa digitar qualquer coisa q n seja numero n vai aparecer nada na tela e o a função é so pra formatar
})

function formatandoValorBRL(value){

    value = value.toLocaleString("pt-BR", { //formatando o value para o propio value na moeda brasileira
        style: "currency", //avisando q to formataando uma moeda
        currency: "BRL" //moeda brasileira
    })

    return value
}

//pegando tudo que a pessoa colocou quando envia o formulario
formulario.addEventListener("submit", (event) =>{
    event.preventDefault() //nao recarregar a pagina quando eu der submit no form
    
    const NovaDespesa = {
        id: new Date().getTime(),//um identificador unico pra uma despesa q pega o tempo q aconteceu 
        nomeDespesa: nomeDespesa.value, //oq foi escrito
        categoria_id: categoria.value, //valor selecionado na caixinha
        categoria_name: categoria.options[categoria.selectedIndex].text, //oq aparece pro usuario no select tem esse [] no options pq eu n quero todas, so quero a com o indice certo
        valorDespesa: valorDespesa.value,//esse valor ja é o formatado
        created_at: new Date() // pegando uma data de quando foi criada
    }

    AddNovaDespesa(NovaDespesa)
})

// adicionando nova despesa na lista de despesas
function AddNovaDespesa(NovaDespesa){
    try {
        //criando item(li) pra add na ul
        const itemDespesa = document.createElement("li")//criei uma li
        itemDespesa.classList.add("expense")//essa é a classe de estilização q tava la no

        //criando icone da categoria
        const iconeDespesa = document.createElement("img")
        iconeDespesa.setAttribute("src", `img/${NovaDespesa.categoria_id}.svg`)//icone definido dinamicamente de acordo com o value selecionado pela pessoa os values da options tem o msm nome das imagens
        iconeDespesa.setAttribute("alt", NovaDespesa.categoria_name)//esse é o negocio da acessibilidade la

        //criando infos da despesa
        const itemInfo = document.createElement("div")//criando a div
        itemInfo.classList.add("expense-info")
        const despesaNome = document.createElement("strong")//criando a strong
        despesaNome.textContent = NovaDespesa.nomeDespesa //adicionando o texto
        const despesaCategoria = document.createElement("span")//criando a span
        despesaCategoria.textContent = NovaDespesa.categoria_name //adicionando o texto
        itemInfo.append(despesaNome, despesaCategoria)//colocando tudo dentro da div

        // criando o valor da despesa
        const totalDespesa = document.createElement("span")//criando a span
        totalDespesa.classList.add("expense-amount")//colocando a classe na div
        totalDespesa.innerHTML = `<small>R$</small>${NovaDespesa.valorDespesa.toUpperCase().replace("R$","")}` //o innerhtml faz com que eu consiga escrever oq eu quero dentro dessa span em formato de html e dentro dessas {} to pegando o valor e colocando nada onde tem R$ pq ele tem um formato especifico

        //criando icone de remover
        const iconeremover = document.createElement("img")
        iconeremover.classList.add("remove-icon")
        iconeremover.setAttribute("src", "img/remove.svg")
        iconeremover.setAttribute("alt", "remover")


        //adicionando informaçoes do item
        itemDespesa.append(iconeDespesa, itemInfo, totalDespesa, iconeremover) //colocando a img, div, span e a img dentro da li
        listaDespesas.append(itemDespesa) //colocando a li dentro da ul

        updateTotals() //sempre q eu adicionar um item na lista to chamando a função de atualizar totais

        formclear()//limpando formulario

    } catch (error) { // caso de algum erro ao add na lista
        alert("Não foi possível atualizar a lista de despesas")//aparece alerta ao usuario
        console.log(error)
    }
}

//atualiza os totais de quantas despesas e o valor em reias
function updateTotals(){
    try {
        //recuperando quantos itens tem na lista
        const items = listaDespesas.children //fala quantos filhos tem ali ou seja quantidade de itens dentro da ul
        quantidadeDespesas.textContent = `${items.length} ${
            items.length > 1 ? "despesas" : "despesa"
        }`//se o item foi maior q um eu escrevo despesas se for menor eu escrevo despesa

        let total = 0 //variavel para percorrer o total
        //percorrendo itens da lista
        for (let i = 0; i < items.length; i++){
            const valoritem = items[i].querySelector(".expense-amount")//coloco esse query selector pq o items é uma li entao tem tudo de dentro da li mas eu quero a tag q tem essa classe especifica

            let value = valoritem.textContent.replace(/[^\d,]+/g, "").replace(",",".")//pegando tudo q n é numero tirando pontos e virgulas e trocando por vazio e depois eu troco virgula pra ponto

            value = parseFloat(value) //convertendo para float pra conseguir fazer contas

            if(isNaN(value)){
                return alert("nao foi possivel calcular o total, o valor parece nao ser um numero")
            }
            //incrementando o valor total
            total += Number(value)
        }

        //criando span para colocar o rs formatado
        const simbolo = document.createElement("small")
        simbolo.textContent = "R$"//adicionando o r difrao la dentro

        // formatando o valor total pra br e tirando o simbolo
        total = formatandoValorBRL(total).toUpperCase().replace("R$","")

        totalDespesa.innerHTML = "" //limpando tudo de html q tem aq dentro

        totalDespesa.append(simbolo, total)//depois to colocando tanto a small quanto o total la dentro


    } catch (error) {
        alert("nao foi possivel atualizar os totais")
        console.log(error)
    }
}

//Evento que captura o click
listaDespesas.addEventListener("click", (event) =>{
    //verificando se o clic foi no icone de remover

    if(event.target.classList.contains("remove-icon")){//verificando se o click foi no icone de remover
        // obtendo a lipai do elemento clicado
        const item = event.target.closest(".expense")//esse closest é o pai mais proximo com essa classe
        item.remove()
    }

    updateTotals()//atualizando o total
})

//depois q eu adiciono um novo ele apaga os campos
function formclear(){
    nomeDespesa.value = ""
    categoria.value = ""
    valorDespesa.value = ""

    nomeDespesa.focus()//chamando o foco pra ca
}