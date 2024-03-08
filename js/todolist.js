;(function(){
    "use strict"

    // ARMAZENAR O DOM EM VARIÁVEIS

    const itemInput = document.getElementById("item-input") // valor digitado no input
    const todoAddForm = document.getElementById("todo-add") // formulario
    const ul = document.getElementById("todo-list") // UL onde ficaraão as LIs
    const lis = ul.getElementsByTagName("li") //coletando TODOS os elementos Li, que estão dentro da UL

    // criamos uma estrutura de dados, que será uma array de objetos
    // cada objeto representará uma tarefa e terá 3 propriedades: --name, createAt, completed--
    // faremos isto, para remover o html qes está "cravado" na página
    /* sendo assim, tendo que fazer com que o JS crie os elementos dinamicamente a partir da estrutura de dados
    */
   
   // função que apenas adiciona em evendo de click, e mostra o this do parâmetro
   // que nesse caso é uma Li
   // function addEventLi(li){
       //     li.addEventListener("click", function (){
           //         console.log(this)
           //     })
           // }
           
    let arrTasks = getSavedData()
    
    function getSavedData(){
        let tasksData = localStorage.getItem("tasks")
        tasksData = JSON.parse(tasksData);
        
        // o "?" separa o retorno se a condição for true
        // o ":" separa o retorno se a condição for false
        /*
        se existe tasksData e tasksData.length, então retorna tasksData
                return tasksData && tasksData.length ? tasksData
        */
        /* senão, me retorna o objeto pré-definido */
        return tasksData && tasksData.length ? tasksData : [
            {
                name: "task 1",
                createAt: Date.now(),
                completed: false
            },
            {
                name: "task 2",
                createAt: Date.now(),
                completed: false
            }
        ]
        
    }

    
    function setNewData(){
        localStorage.setItem("tasks",JSON.stringify(arrTasks))
    }

    setNewData()

    // a função generateLiTask receberá um objeto vindo de arrTasks e retornará uma Li
    // a função generateLiTask será responsável por criar dinamicamente as Lis
    // e também fazer os appenChilds correspondentes
    function generateLiTask(obj){
        // elementos criados dinamicamente
        const li = document.createElement("li") 
        const p = document.createElement("p")
        const checkButton = document.createElement("button")
        const editButton = document.createElement("i")
        const deleteButton = document.createElement("i")

        li.className = "todo-item"

        checkButton.className = "button-check"
        checkButton.setAttribute("data-action","checkButton")
        checkButton.innerHTML = `
        <i class="fas fa-check ${obj.completed ?"":"displayNone"}" data-action="checkButton"></i>`

        li.appendChild(checkButton)

        // pegamos os elementos dinamicos e damos classe a eles
        // e fazemos os appendChilds na Li
        p.className = "task-name"
        p.textContent = obj.name
        li.appendChild(p)

        editButton.className = " fas fa-edit"
        editButton.setAttribute("data-action","editButton")
        li.appendChild(editButton)

        const containerEdit = document.createElement("div")
        containerEdit.className = "editContainer"
        const inputEdit = document.createElement("input")
        inputEdit.setAttribute("type", "text")
        inputEdit.className = "editInput"
        inputEdit.value = obj.name

        containerEdit.appendChild(inputEdit)
        const containerEditButton = document.createElement("button")
        containerEditButton.className = "editButton"
        containerEditButton.textContent = "Edit"
        containerEditButton.setAttribute("data-action","containerEditButton")
        containerEdit.appendChild(containerEditButton)

        const containerCancelButton = document.createElement("button")
        containerCancelButton.className = "cancelButton"
        containerCancelButton.textContent = "Cancel"
        containerCancelButton.setAttribute("data-action","containerCancelButton")
        containerEdit.appendChild(containerCancelButton)

        li.appendChild(containerEdit)

        deleteButton.className = "fas fa-trash-alt"
        deleteButton.setAttribute("data-action","deleteButton")
        li.appendChild(deleteButton)



        // addEventLi(li)
        return li
    }

    // a função renderTasks será responsável por "olhar" para o generateLitask
    // e renderizar as informações na tela
    function renderTasks(){
        ul.innerHTML = "" // aqui limparemos a nossa lista antes de adicionar elementos 

        // usaremos o forEach para iterar sobre o array arrTasks e criar um objeto para cada elemento gerado
        arrTasks.forEach(taskObj =>{
            ul.appendChild(generateLiTask(taskObj))
        })
    }


    function addTask(task){
        arrTasks.push({
            name: task,
            createAt: Date.now(),
            completed: false
        })
        setNewData()
    }

    function clickedUl(e){
        const dataAction = e.target.getAttribute("data-action")
        console.log(e.target)
        if(!dataAction) return

        // vamos recuperar a Li a partir do elemento clicado, desde que o elemento tenha data-action
        // utilizando o parentElement, ele fará uma varredura desde o elemento clicado
        // até o ultimo, e vai parar assim que encontrar a li , caso contenha data-action
        let currentLi = e.target
        while(currentLi.nodeName !== "LI"){
            currentLi = currentLi.parentElement
        }
        
        // recuperamos o índice da Li(tarefa) gerada dinamicamente
        // faremos uma simulação de array de Lis(usando spread-Operator)
        // a partir daí, recuperamos o índice da Li que foi recuperada acima(currentLi)
        const currentLiIndex = [...lis].indexOf(currentLi)




        const actions = {
            editButton: function(){
                const editContainer = currentLi.querySelector(".editContainer");

                [...ul.querySelectorAll(".editContainer")].forEach(container =>{
                    container.removeAttribute("style")
                });

                editContainer.style.display = "flex";
            },
            deleteButton: function(){
                arrTasks.splice(currentLiIndex, 1)
                console.log(arrTasks)
                renderTasks()
                setNewData()
                // currentLi.parentElement.removeChild(currentLi)
            },
            containerEditButton: function(){
                const val = currentLi.querySelector(".editInput").value
                arrTasks[currentLiIndex].name = val
                renderTasks()
                setNewData()
            },
            containerCancelButton:function(){
                currentLi.querySelector(".editContainer").removeAttribute("style")
                
                currentLi.querySelector(".editInput").value = arrTasks[currentLiIndex].name
            },
            checkButton: function(){
                arrTasks[currentLiIndex].completed = !arrTasks[currentLiIndex].completed
                // if(arrTasks[currentLiIndex].completed){
                //     currentLi.querySelector(".fa-check").classList.remove("displayNone")
                // }else{
                //     currentLi.querySelector(".fa-check").classList.add("displayNone")
                // }
                setNewData()
                renderTasks()
            }
        }

        

        if(actions[dataAction]){
            actions[dataAction]()
        }
    }


    todoAddForm.addEventListener("submit", function(e){
        e.preventDefault()
        console.log(itemInput.value)
        // ul.innerHTML += `
        //     <li class="todo-item">
        //         <p class="task-name">${itemInput.value}</p>
        //     </li>
        // `

        /*
            substituimos o innerHTML, pela função addTask, criando os elementos dinamicamente
            pois, quando trabalhamos com eventos, não podemos usar innerHTML.
            Isso pq o innerHTML remove os eventos atrelados ao DOM que havia antes que haja
            o incremento, ou seja, quando o innerHTML é ativado, ele limpa a pagina com os eventos
            e a reescreve sem eles
        */
        addTask(itemInput.value)
        renderTasks()
        itemInput.value = ""
        itemInput.focus()
    });


    ul.addEventListener("click", clickedUl)



    renderTasks()
    
})()
