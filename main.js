// CREATE
var products = [];
var idProduct = 0

function getProductsFromLocalStorage() {
    var retrivedproducts = JSON.parse(localStorage.getItem("products"));

    if(retrivedproducts === null) {
        products = [];
    }else {
        products = retrivedproducts;
        showBtnDeleteAll(products)
    }
}

getProductsFromLocalStorage();

function showBtnDeleteAll(products) {
    if(products.length >= 1) {
        document.getElementById("deleteAll").innerHTML = `
            <button onclick="deleteAllProducts()"
                    type="button" 
                    class="form-control 
                           inp 
                           bg-danger 
                           text-white 
                           border border-0" 
                           id="delete">
                DELETE ALL (${products.length})
            </button>
        `;
    }
}

function create() {
    var title = document.getElementById("title").value;
    var price = document.getElementById("price").value;
    var taxes = document.getElementById("taxes").value;
    var ads = document.getElementById("ads").value;
    var discount = document.getElementById("discount").value;
    var count = document.getElementById("count").value;
    var category = document.getElementById("category").value;

    var product = {};
    idProduct++;
    
    product.id = products.length+1;
    product.title = title;
    product.price = price;
    product.taxes = taxes;
    product.ads = ads;
    product.discount = discount;
    product.total = ((Number(price) + Number(taxes) + Number(ads)) - Number(discount));
    document.getElementById("total").innerHTML = product.total;
    product.count = count;
    product.category = category;

    products.push(product);

    storeProducts();

    showBtnDeleteAll(products);

    read();

    document.getElementById("title").value = "";
    document.getElementById("price").value = "";
    document.getElementById("taxes").value = "";
    document.getElementById("ads").value = "";
    document.getElementById("discount").value = "";
    document.getElementById("count").value = "";
    document.getElementById("category").value = "";
}

read();
// READ
function read() {
    document.getElementById("tBody").innerHTML = "";
    for (const product of products) {
        var content = `
            <tr>
                <th scope="row">${products.indexOf(product)+1}</th>
                <td>${product.title}</td>
                <td>${product.price}</td>
                <td>${product.taxes}</td>
                <td>${product.ads}</td>
                <td>${product.discount}</td>
                <td>${product.total}</td>
                <td>${product.count}</td>
                <td>${product.category}</td>
                <td>
                    <button onclick="getProductDetails(${product.id})" class="btn btn-success border border-0">UPDATE</button>
                </td>
                <td>
                    <button onclick="deleteP(${product.id})" class="btn btn-danger border border-0">DELETE</button>
                </td>
            </tr>
        `;
        document.getElementById("tBody").innerHTML += content;
    }
}

// UPDATE
function getProductDetails(id) {
    for (const product of products) {
       if(product.id === id) {
            document.getElementById("title").value = product.title;
            document.getElementById("price").value = product.price;
            document.getElementById("taxes").value = product.taxes;
            document.getElementById("ads").value = product.ads;
            document.getElementById("discount").value = product.discount;
            document.getElementById("count").value = product.count;
            document.getElementById("category").value = product.category;
            document.getElementById("total").innerHTML = product.total;

            document.getElementById("createDiv").innerHTML = "";
            document.getElementById("createDiv").innerHTML = `
                <button onclick="update(${product.id})" 
                        type="button" 
                        class="form-control 
                               inp 
                               bg-success 
                               text-white 
                               border border-0" 
                               id="update">
                    UPDATE
                </button>
            `;

            return;
        }
    }
}

function update(id) {
    for (const product of products) {
        if(product.id === id) {
            var title = document.getElementById("title").value;
            var price = document.getElementById("price").value;
            var taxes = document.getElementById("taxes").value;
            var ads = document.getElementById("ads").value;
            var discount = document.getElementById("discount").value;
            var count = document.getElementById("count").value;
            var category = document.getElementById("category").value; 

            product.id = id;
            product.title = title;
            product.price = price;
            product.taxes = taxes;
            product.ads = ads;
            product.discount = discount;
            product.total = ((Number(price) + Number(taxes) + Number(ads)) - Number(discount));
            document.getElementById("total").innerHTML = product.total;
            product.count = count;
            product.category = category;

            products.splice(id-1, 1, product);

            storeProducts();

            read();

            return;
        }
    }
}

// DELETE
function deleteP(id) {
    for (const product of products) {
       if(product.id === id) {
            var isDeleted = confirm(`Are you sure you want to delete : ${product.title} ?`);

            if(isDeleted) {
                var isAll = confirm(`you want to delete all items of : ${product.title} Or juste some items ?`);

                if(isAll) {
                    products.splice(id-1, 1);
                    storeProducts();
                    showBtnDeleteAll(products);
                    read();
                }else {
                    var numberOfItems = Number(prompt(`Give me number of items you want to delete from ${product.count} of ${product.title}`));
                    
                    if(numberOfItems <= Number(product.count)) {

                        if(numberOfItems === Number(product.count)) {
                            product.count = Number(product.count) - numberOfItems;
                            products.splice(id-1, 1);
                            storeProducts();
                            showBtnDeleteAll(products);
                            read();
                        }else {
                            product.count = Number(product.count) - numberOfItems;
                            storeProducts();
                            showBtnDeleteAll(products);
                            read();
                        }

                    }else {
                        alert(`${numberOfItems} more then ${product.count}`);
                        read();
                    }

                }
            }
            return;
       } 
    }
}

function deleteAllProducts() {
    var deleteAll = confirm(`Are you sure you want to delete all items ?`);
    if(deleteAll) {
        products = [];
        storeProducts();
        idProduct = 0;
        var idProductString = JSON.stringify(idProduct);
        localStorage.setItem("idProduct", idProductString);
        document.getElementById("deleteAll").innerHTML = "";
        read();
    }
}

// SEARCH BY TITLE AND CATEGORY
function changePlaceholder(idArg) {
    document.querySelector(".search-specific").id = idArg;
    var searchInp = document.getElementById(idArg);
    if(idArg === "sbt") {
        searchInp.placeholder = "search by title";
        search("sbt");
    }else {
        searchInp.placeholder = "search by category";
        search("sbc");
    }
}

function search(id) {
    var searchValue = document.getElementById(id).value.trim();
    console.log(searchValue);

    // Si l'utilisateur a tapé quelque chose
    if (searchValue !== "") {
        document.getElementById("tBody").innerHTML = "";
        var found = false;

        // Boucle sur la liste des produits pour rechercher par titre ou catégorie
        for (const product of products) {
            if ((id === "sbt" && product.title.toLowerCase().includes(searchValue.toLowerCase())) || 
                (id === "sbc" && product.category.toLowerCase().includes(searchValue.toLowerCase()))) {
                
                var content = `
                    <tr>
                        <th scope="row">${product.id}</th>
                        <td>${product.title}</td>
                        <td>${product.price}</td>
                        <td>${product.taxes}</td>
                        <td>${product.ads}</td>
                        <td>${product.discount}</td>
                        <td>${product.total}</td>
                        <td>${product.count}</td>
                        <td>${product.category}</td>
                        <td>
                            <button onclick="getProductDetails(${product.id})" class="btn btn-success border border-0">UPDATE</button>
                        </td>
                        <td>
                            <button onclick="deleteP(${product.id})" class="btn btn-danger border border-0">DELETE</button>
                        </td>
                    </tr>
                `;
                document.getElementById("tBody").innerHTML += content;
                found = true;
            }
        }

        // Si aucun produit n'est trouvé
        if (!found) {
            document.getElementById("tBody").innerHTML = `
                <div class="alert alert-warning alert-dismissible fade show" role="alert w">
                    Product NOT FOUND
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>
            `;
        }

    // Si la recherche est vide, afficher tous les produits (ou une autre action)
    } else {
        read();  // Cette fonction doit être définie pour afficher la liste complète des produits
    }
}

// STORAGE FUNCTIONS
function storeProducts() {
    var productsString = JSON.stringify(products);
    localStorage.setItem("products", productsString);
}