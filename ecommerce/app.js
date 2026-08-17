const products=[
{id:1,name:"Wireless Headphones",category:"Electronics",price:2499,stock:8,rating:4.4,image:"https://picsum.photos/seed/headphones/600/450",desc:"Comfortable wireless headphones with clear sound and long battery life."},
{id:2,name:"Smart Watch",category:"Electronics",price:3999,stock:5,rating:4.2,image:"https://picsum.photos/seed/smartwatch/600/450",desc:"Fitness and notification smartwatch with multiple watch faces."},
{id:3,name:"Running Shoes",category:"Fashion",price:2999,stock:12,rating:4.6,image:"https://picsum.photos/seed/runningshoes/600/450",desc:"Lightweight running shoes designed for everyday training."},
{id:4,name:"Travel Backpack",category:"Fashion",price:1499,stock:0,rating:4.1,image:"https://picsum.photos/seed/backpack/600/450",desc:"Durable everyday backpack with laptop compartment."},
{id:5,name:"Coffee Maker",category:"Home",price:4599,stock:6,rating:4.5,image:"https://picsum.photos/seed/coffeemaker/600/450",desc:"Compact coffee maker for home and office use."},
{id:6,name:"Desk Lamp",category:"Home",price:999,stock:20,rating:4.3,image:"https://picsum.photos/seed/desklamp/600/450",desc:"Adjustable LED desk lamp with multiple brightness levels."},
{id:7,name:"Laptop Stand",category:"Electronics",price:1799,stock:10,rating:4.7,image:"https://picsum.photos/seed/laptopstand/600/450",desc:"Aluminium adjustable stand for laptops and tablets."},
{id:8,name:"Cotton T-Shirt",category:"Fashion",price:799,stock:18,rating:4.0,image:"https://picsum.photos/seed/tshirt/600/450",desc:"Soft cotton everyday T-shirt available in several sizes."}
];

let db=JSON.parse(localStorage.getItem("shopSphereDB")||"null")||{
user:null,registeredUsers:[],cart:[],wishlist:[],addresses:[],orders:[],notifications:[],failedLogins:0,locked:false
};
let currentPage="home";

const app=document.getElementById("app");
const banner=document.getElementById("banner");
const money=n=>"₹"+Number(n).toLocaleString("en-IN");
const save=()=>localStorage.setItem("shopSphereDB",JSON.stringify(db));
const toast=(msg)=>{let t=document.getElementById("toast");t.textContent=msg;t.style.display="block";clearTimeout(window.tt);window.tt=setTimeout(()=>t.style.display="none",2600)};
const findProduct=id=>products.find(p=>p.id==id);
const cartCount=()=>db.cart.reduce((s,x)=>s+x.qty,0);

function updateHeader(){
document.getElementById("cartCount").textContent=cartCount();
document.getElementById("wishCount").textContent=db.wishlist.length;
document.getElementById("accountBtn").textContent=db.user?`Hi, ${db.user.name.split(" ")[0]}`:"Account";
}
function go(page,arg=null){currentPage=page;banner.style.display=page==="home"?"flex":"none";
if(page==="home")home();if(page==="products")productsPage(arg);if(page==="product")productPage(arg);
if(page==="cart")cartPage();if(page==="wishlist")wishlistPage();if(page==="account")accountPage();
if(page==="checkout")checkoutPage();if(page==="orders")ordersPage();if(page==="address")addressPage();
updateHeader();window.scrollTo(0,0)}

function home(){
app.innerHTML=`<section class="page-title"><div><h1>Welcome to ShopSphere</h1><p class="muted">A realistic front-end e-commerce application for QA practice.</p></div></section>
<div class="card"><h2>Shop by Category</h2><div class="grid">
${["Electronics","Fashion","Home"].map(c=>`<div class="category" onclick="go('products','${c}')"><h3>${c}</h3><p class="muted">Explore ${c.toLowerCase()} products</p></div>`).join("")}</div></div>
<div class="page-title"><h2>Featured Products</h2><button class="secondary" onclick="go('products')">View All</button></div>
<div class="grid">${products.slice(0,4).map(productCard).join("")}</div>`;
}
function productCard(p){return `<article class="product"><img src="${p.image}" alt="${p.name}"><div class="product-body"><h3>${p.name}</h3><div class="muted">${p.category} · ★ ${p.rating}</div><div class="price">${money(p.price)}</div><span class="badge ${p.stock?"in":"out"}">${p.stock?`In Stock (${p.stock})`:"Out of Stock"}</span><div class="actions"><button class="primary" onclick="addCart(${p.id})" ${p.stock?"":"disabled"}>Add to Cart</button><button class="secondary" onclick="toggleWish(${p.id})">♡</button><button class="secondary" onclick="go('product',${p.id})">Details</button></div></div></article>`}

function productsPage(category=null){
let list=[...products],cat=category||"";
app.innerHTML=`<div class="page-title"><div><h1>Products</h1><p class="muted">Browse, filter and sort the catalog.</p></div>
<div><select id="sort" onchange="refreshProducts()"><option value="">Sort</option><option value="low">Price: Low to High</option><option value="high">Price: High to Low</option><option value="rating">Rating</option></select></div></div>
<div class="card"><div class="form-grid"><div class="field"><label>Category</label><select id="filterCat" onchange="refreshProducts()"><option value="">All</option>${["Electronics","Fashion","Home"].map(c=>`<option ${cat===c?"selected":""}>${c}</option>`).join("")}</select></div><div class="field"><label>Availability</label><select id="filterStock" onchange="refreshProducts()"><option value="">All</option><option value="in">In Stock</option><option value="out">Out of Stock</option></select></div></div></div><div id="productGrid" class="grid"></div>`;
refreshProducts()
}
function refreshProducts(){
let list=[...products],cat=document.getElementById("filterCat")?.value||"",stock=document.getElementById("filterStock")?.value||"",sort=document.getElementById("sort")?.value||"";
if(cat)list=list.filter(p=>p.category===cat);if(stock==="in")list=list.filter(p=>p.stock>0);if(stock==="out")list=list.filter(p=>!p.stock);
if(sort==="low")list.sort((a,b)=>a.price-b.price);if(sort==="high")list.sort((a,b)=>b.price-a.price);if(sort==="rating")list.sort((a,b)=>b.rating-a.rating);
document.getElementById("productGrid").innerHTML=list.length?list.map(productCard).join(""):`<div class="notice">No products match your filters.</div>`
}
function productPage(id){
let p=findProduct(id);
app.innerHTML=`<div class="card"><button class="secondary" onclick="go('products')">← Back</button><div class="two-col" style="margin-top:15px"><div><img src="${p.image}" alt="${p.name}" style="width:100%;border-radius:10px;max-height:500px;object-fit:cover"></div><div><span class="badge">${p.category}</span><h1>${p.name}</h1><p>★★★★★ <b>${p.rating}</b></p><h2>${money(p.price)}</h2><p>${p.desc}</p><p>${p.stock?`Available quantity: ${p.stock}`:"Currently unavailable"}</p>
<div class="form-grid"><div class="field"><label>Size</label><select><option>Standard</option><option>Small</option><option>Medium</option><option>Large</option></select></div><div class="field"><label>Color</label><select><option>Black</option><option>Blue</option><option>White</option></select></div></div>
<div class="actions"><button class="primary" onclick="addCart(${p.id})" ${p.stock?"":"disabled"}>Add to Cart</button><button class="secondary" onclick="toggleWish(${p.id})">Add to Wishlist</button></div>
<div class="card" style="margin-top:18px"><h3>Customer Reviews</h3><p>★★★★☆ Good product quality and fast delivery.</p><p>★★★★★ Matches the description.</p></div></div></div></div>`
}

function addCart(id){
let p=findProduct(id);if(!p.stock){toast("This product is out of stock");return}
let x=db.cart.find(x=>x.id===id);if(x){if(x.qty<p.stock)x.qty++;else{toast("Maximum available quantity reached");return}}else db.cart.push({id,qty:1});
save();updateHeader();toast("Product added to cart")
}
function removeCart(id){db.cart=db.cart.filter(x=>x.id!==id);save();cartPage();updateHeader()}
function changeQty(id,val){let x=db.cart.find(x=>x.id===id),p=findProduct(id);if(!x)return;x.qty=Math.max(1,Math.min(Number(val)||1,p.stock));save();cartPage();updateHeader()}
function toggleWish(id){let i=db.wishlist.indexOf(id);if(i>=0){db.wishlist.splice(i,1);toast("Removed from wishlist")}else{db.wishlist.push(id);toast("Added to wishlist")}save();updateHeader()}

function cartPage(){
let subtotal=db.cart.reduce((s,x)=>s+findProduct(x.id).price*x.qty,0),shipping=subtotal?99:0,tax=subtotal*.05,total=subtotal+shipping+tax;
app.innerHTML=`<div class="page-title"><h1>Shopping Cart</h1><span class="muted">${cartCount()} item(s)</span></div>${!db.cart.length?`<div class="card"><div class="notice">Your cart is empty.</div><button class="primary" onclick="go('products')">Continue Shopping</button></div>`:
`<div class="two-col"><div class="card">${db.cart.map(x=>{let p=findProduct(x.id);return `<div class="cart-row"><img src="${p.image}" alt="${p.name}"><div><b>${p.name}</b><div class="muted">${money(p.price)} each</div></div><input class="qty" type="number" min="1" max="${p.stock}" value="${x.qty}" onchange="changeQty(${p.id},this.value)"><button class="danger" onclick="removeCart(${p.id})">Remove</button></div>`}).join("")}</div><div class="card summary"><h2>Summary</h2><p>Subtotal <span style="float:right">${money(subtotal)}</span></p><p>Shipping <span style="float:right">${money(shipping)}</span></p><p>Tax <span style="float:right">${money(tax)}</span></p><hr><h3>Total <span style="float:right">${money(total)}</span></h3><button class="primary" style="width:100%" onclick="go('checkout')">Proceed to Checkout</button></div></div>`}`
}

function wishlistPage(){
app.innerHTML=`<div class="page-title"><h1>Wishlist</h1><span class="muted">${db.wishlist.length} item(s)</span></div>${db.wishlist.length?`<div class="grid">${db.wishlist.map(id=>productCard(findProduct(id))).join("")}</div>`:`<div class="card"><div class="notice">Your wishlist is empty.</div></div>`}`
}

function accountPage(){
if(!db.user){loginPage();return}
app.innerHTML=`<div class="page-title"><h1>My Account</h1></div><div class="profile-grid"><div class="side-menu"><button onclick="accountPage()">Profile</button><button onclick="addressPage()">Addresses</button><button onclick="ordersPage()">Orders</button><button onclick="logout()">Logout</button></div><div><div class="card"><h2>Profile</h2><div class="form-grid"><div class="field"><label>Name</label><input id="profileName" value="${db.user.name}"></div><div class="field"><label>Email</label><input value="${db.user.email}" disabled></div><div class="field"><label>Mobile</label><input id="profileMobile" value="${db.user.mobile||""}"></div></div><div class="actions"><button class="primary" onclick="saveProfile()">Save Changes</button><button class="secondary" onclick="changePassword()">Change Password</button></div></div></div></div>`
}
function saveProfile(){db.user.name=document.getElementById("profileName").value.trim();db.user.mobile=document.getElementById("profileMobile").value.trim();save();updateHeader();toast("Profile updated")}
function changePassword(){showModal(`<h2>Change Password</h2><div class="field"><label>Current Password</label><input id="oldPwd" type="password"></div><br><div class="field"><label>New Password</label><input id="newPwd" type="password"></div><div id="pwdMsg"></div><div class="actions"><button class="primary" onclick="doChangePassword()">Change Password</button><button class="secondary" onclick="closeModal()">Cancel</button></div>`)}
function doChangePassword(){let u=db.registeredUsers.find(u=>u.email===db.user.email);if(!u||u.password!==document.getElementById("oldPwd").value){pwdMsg.innerHTML='<div class="error">Current password is incorrect.</div>';return}let n=document.getElementById("newPwd").value;if(n.length<8){pwdMsg.innerHTML='<div class="error">Password must contain at least 8 characters.</div>';return}u.password=n;save();closeModal();toast("Password changed")}

function loginPage(){
app.innerHTML=`<div class="card form"><h1>Login</h1><p class="muted">Use a registered account.</p><div class="field"><label>Email</label><input id="loginEmail" type="email"></div><br><div class="field"><label>Password</label><input id="loginPassword" type="password"></div><div id="loginMsg"></div><div class="actions"><button class="primary" onclick="login()">Login</button><button class="secondary" onclick="forgotPassword()">Forgot Password?</button><button class="secondary" onclick="registerPage()">Create Account</button></div></div>`
}
function login(){
if(db.locked){loginMsg.innerHTML='<div class="error">Account is temporarily locked after repeated failed attempts.</div>';return}
let email=document.getElementById("loginEmail").value.trim(),password=document.getElementById("loginPassword").value,u=db.registeredUsers.find(x=>x.email===email);
if(u&&u.password===password){db.user={name:u.name,email:u.email,mobile:u.mobile};db.failedLogins=0;save();toast("Login successful");go('home');return}
db.failedLogins++;if(db.failedLogins>=3)db.locked=true;save();loginMsg.innerHTML=`<div class="error">Invalid credentials. Failed attempts: ${db.failedLogins}/3</div>`
}
function logout(){db.user=null;save();toast("Logged out");go("home")}
function forgotPassword(){showModal(`<h2>Forgot Password</h2><p>Enter your registered email. This demo simulates the reset flow.</p><div class="field"><label>Email</label><input id="resetEmail" type="email"></div><div id="resetMsg"></div><div class="actions"><button class="primary" onclick="sendReset()">Send Reset</button><button class="secondary" onclick="closeModal()">Cancel</button></div>`)}
function sendReset(){let email=resetEmail.value.trim(),u=db.registeredUsers.find(x=>x.email===email);resetMsg.innerHTML=u?'<div class="success">Password reset link simulated successfully.</div>':'<div class="error">No account found for this email.</div>'}

function registerPage(){
app.innerHTML=`<div class="card form"><h1>Create Account</h1><div class="form-grid"><div class="field"><label>Full Name</label><input id="regName"></div><div class="field"><label>Email</label><input id="regEmail" type="email"></div><div class="field"><label>Mobile</label><input id="regMobile" maxlength="10"></div><div class="field"><label>Password</label><input id="regPass" type="password"></div><div class="field"><label>Confirm Password</label><input id="regConfirm" type="password"></div><div class="field"><label>OTP</label><input id="regOtp" placeholder="Demo OTP: 123456"></div></div><div id="regMsg"></div><div class="actions"><button class="primary" onclick="register()">Register</button><button class="secondary" onclick="loginPage()">Back to Login</button></div></div>`
}
function register(){
let name=regName.value.trim(),email=regEmail.value.trim(),mobile=regMobile.value.trim(),pass=regPass.value,confirm=regConfirm.value,otp=regOtp.value.trim();
if(!name||!email||!mobile||!pass||!confirm||!otp){regMsg.innerHTML='<div class="error">All mandatory fields are required.</div>';return}
if(db.registeredUsers.some(u=>u.email===email)){regMsg.innerHTML='<div class="error">Email already registered.</div>';return}
if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){regMsg.innerHTML='<div class="error">Invalid email format.</div>';return}
if(!/^\d{10}$/.test(mobile)){regMsg.innerHTML='<div class="error">Mobile number must contain 10 digits.</div>';return}
if(pass.length<8||!/[A-Z]/.test(pass)||!/[a-z]/.test(pass)||!/\d/.test(pass)){regMsg.innerHTML='<div class="error">Password must have 8+ characters, upper/lowercase and a number.</div>';return}
if(pass!==confirm){regMsg.innerHTML='<div class="error">Passwords do not match.</div>';return}
if(otp!=="123456"){regMsg.innerHTML='<div class="error">Invalid verification OTP.</div>';return}
db.registeredUsers.push({name,email,mobile,password:pass});db.user={name,email,mobile};db.failedLogins=0;db.locked=false;save();toast("Registration successful");go("home")
}

function addressPage(){
if(!db.user){loginPage();return}
app.innerHTML=`<div class="page-title"><h1>Delivery Addresses</h1><button class="primary" onclick="showAddressForm()">Add Address</button></div><div class="grid">${db.addresses.length?db.addresses.map((a,i)=>`<div class="card"><b>${a.name}</b> ${a.default?'<span class="badge in">Default</span>':''}<p>${a.line}<br>${a.city}, ${a.state} - ${a.pin}<br>Mobile: ${a.mobile}</p><div class="actions"><button class="secondary" onclick="showAddressForm(${i})">Edit</button><button class="danger" onclick="deleteAddress(${i})">Delete</button><button class="secondary" onclick="setDefaultAddress(${i})">Set Default</button></div></div>`).join(""):`<div class="card"><div class="notice">No saved addresses.</div></div>`}</div>`
}
function showAddressForm(index=null){
let a=index!==null?db.addresses[index]:{name:db.user.name,line:"",city:"",state:"",pin:"",mobile:db.user.mobile||"",default:false};
showModal(`<h2>${index===null?"Add":"Edit"} Address</h2><div class="form-grid"><div class="field"><label>Name</label><input id="aName" value="${a.name}"></div><div class="field"><label>Mobile</label><input id="aMobile" value="${a.mobile}"></div><div class="field full"><label>Address</label><textarea id="aLine">${a.line}</textarea></div><div class="field"><label>City</label><input id="aCity" value="${a.city}"></div><div class="field"><label>State</label><input id="aState" value="${a.state}"></div><div class="field"><label>PIN</label><input id="aPin" value="${a.pin}"></div></div><div id="aMsg"></div><div class="actions"><button class="primary" onclick="saveAddress(${index===null?-1:index})">Save</button><button class="secondary" onclick="closeModal()">Cancel</button></div>`)
}
function saveAddress(index){
let a={name:aName.value.trim(),mobile:aMobile.value.trim(),line:aLine.value.trim(),city:aCity.value.trim(),state:aState.value.trim(),pin:aPin.value.trim(),default:index>=0?db.addresses[index].default:false};
if(!a.name||!a.mobile||!a.line||!a.city||!a.state||!a.pin){aMsg.innerHTML='<div class="error">All address fields are required.</div>';return}
if(index<0)db.addresses.push(a);else db.addresses[index]=a;save();closeModal();addressPage()
}
function deleteAddress(i){db.addresses.splice(i,1);save();addressPage();toast("Address deleted")}
function setDefaultAddress(i){db.addresses.forEach((a,j)=>a.default=j===i);save();addressPage();toast("Default address updated")}

function checkoutPage(){
if(!db.cart.length){go("cart");return}if(!db.user){loginPage();return}
let subtotal=db.cart.reduce((s,x)=>s+findProduct(x.id).price*x.qty,0),shipping=99,tax=subtotal*.05;
app.innerHTML=`<div class="page-title"><h1>Checkout</h1></div><div class="two-col"><div><div class="card"><h2>Delivery Address</h2>${db.addresses.length?db.addresses.map((a,i)=>`<label style="display:block;padding:10px;border:1px solid #ddd;margin:8px 0;border-radius:6px"><input type="radio" name="address" value="${i}" ${a.default?"checked":""}> ${a.name}, ${a.line}, ${a.city}, ${a.state} - ${a.pin}</label>`).join(""):`<div class="notice">Add a delivery address before placing the order.</div>`}<button class="secondary" onclick="showAddressForm()">Add Address</button></div><div class="card"><h2>Payment Method</h2><div class="field"><label>Method</label><select id="payMethod"><option>Credit/Debit Card</option><option>UPI</option><option>Net Banking</option><option>Wallet</option></select></div><br><div class="form-grid"><div class="field"><label>Payment Reference / Card</label><input id="payRef" placeholder="Demo value"></div><div class="field"><label>Coupon</label><input id="coupon" placeholder="Try SAVE10"></div></div><div id="payMsg"></div></div></div><div class="card summary"><h2>Order Summary</h2>${db.cart.map(x=>{let p=findProduct(x.id);return `<p>${p.name} × ${x.qty}<span style="float:right">${money(p.price*x.qty)}</span></p>`}).join("")}<hr><p>Subtotal <span style="float:right">${money(subtotal)}</span></p><p>Shipping <span style="float:right">${money(shipping)}</span></p><p>Tax <span style="float:right">${money(tax)}</span></p><h3>Total <span style="float:right" id="checkoutTotal">${money(subtotal+shipping+tax)}</span></h3><button class="primary" style="width:100%" onclick="placeOrder(${subtotal},${shipping},${tax})">Place Order</button></div></div>`
}
function placeOrder(subtotal,shipping,tax){
let selected=document.querySelector('input[name="address"]:checked'),ref=document.getElementById("payRef").value.trim();
if(!db.addresses.length){payMsg.innerHTML='<div class="error">Please add a delivery address.</div>';return}
if(!selected){payMsg.innerHTML='<div class="error">Please select a delivery address.</div>';return}
if(!ref){payMsg.innerHTML='<div class="error">Payment details are required.</div>';return}
let discount=document.getElementById("coupon").value.trim()==="SAVE10"?subtotal*.1:0,total=subtotal+shipping+tax-discount;
let order={id:"ORD"+Date.now(),date:new Date().toLocaleString(),items:db.cart.map(x=>({id:x.id,qty:x.qty})),total,status:"Confirmed",payment:document.getElementById("payMethod").value};
db.orders.unshift(order);db.cart=[];db.notifications.unshift({text:`Order ${order.id} confirmed`,date:order.date});
save();showModal(`<h2>Order Confirmed</h2><p>Thank you for your purchase.</p><p><b>Order ID:</b> ${order.id}</p><p><b>Total:</b> ${money(total)}</p><p>Payment: ${order.payment}</p><button class="primary" onclick="closeModal();go('orders')">View Orders</button>`);updateHeader()
}

function ordersPage(){
if(!db.user){loginPage();return}
app.innerHTML=`<div class="page-title"><h1>My Orders</h1></div>${db.orders.length?db.orders.map(o=>`<div class="order"><div style="display:flex;justify-content:space-between"><b>${o.id}</b><span class="badge in">${o.status}</span></div><p class="muted">${o.date} · ${o.payment}</p><p><b>Total: ${money(o.total)}</b></p><div class="actions"><button class="secondary" onclick="trackOrder('${o.id}')">Track Order</button>${o.status!=="Cancelled"?`<button class="danger" onclick="cancelOrder('${o.id}')">Cancel Order</button>`:""}<button class="secondary" onclick="orderDetails('${o.id}')">Details</button></div></div>`).join(""):`<div class="card"><div class="notice">No orders yet.</div></div>`}`
}
function trackOrder(id){showModal(`<h2>Order Tracking</h2><p><b>${id}</b></p><p>✓ Order placed</p><p>✓ Payment confirmed</p><p>✓ Packed</p><p>→ Shipped</p><p>○ Out for delivery</p><p>○ Delivered</p><button class="secondary" onclick="closeModal()">Close</button>`)}
function cancelOrder(id){let o=db.orders.find(x=>x.id===id);if(!o)return;o.status="Cancelled";db.notifications.unshift({text:`Order ${id} cancelled. Refund initiated.`,date:new Date().toLocaleString()});save();ordersPage();toast("Order cancelled")}
function orderDetails(id){let o=db.orders.find(x=>x.id===id);showModal(`<h2>Order Details</h2><p><b>Order:</b> ${o.id}</p><p><b>Date:</b> ${o.date}</p><p><b>Status:</b> ${o.status}</p><p><b>Total:</b> ${money(o.total)}</p><h3>Items</h3>${o.items.map(x=>{let p=findProduct(x.id);return `<p>${p.name} × ${x.qty}</p>`}).join("")}<button class="secondary" onclick="closeModal()">Close</button>`)}

function showModal(content){let m=document.createElement("div");m.id="modal";m.className="modal";m.innerHTML=`<div class="modal-card">${content}</div>`;document.body.appendChild(m)}
function closeModal(){document.getElementById("modal")?.remove()}

const searchInput=document.getElementById("searchInput"),suggestions=document.getElementById("suggestions");
searchInput.addEventListener("input",()=>{
let q=searchInput.value.trim().toLowerCase();if(!q){suggestions.style.display="none";return}
let arr=products.filter(p=>p.name.toLowerCase().includes(q)).slice(0,5);
suggestions.innerHTML=arr.map(p=>`<div onclick="searchSelect(${p.id})">${p.name} <small>— ${money(p.price)}</small></div>`).join("");
suggestions.style.display=arr.length?"block":"none"
});
function searchSelect(id){suggestions.style.display="none";searchInput.value=findProduct(id).name;go("product",id)}
document.addEventListener("click",e=>{if(!e.target.closest(".search-wrap"))suggestions.style.display="none"});

updateHeader();home();
