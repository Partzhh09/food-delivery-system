const express    = require("express");
const cors       = require("cors");
const bcrypt     = require("bcryptjs");
const jwt        = require("jsonwebtoken");
const mongoose   = require("mongoose");
const crypto     = require("crypto");
const path       = require("path");

const app = express();
app.use(cors({ origin: "*", methods: ["GET","POST","PUT","PATCH","DELETE"], allowedHeaders: ["Content-Type","Authorization"] }));
app.use(express.json());
app.use("/admin", express.static(path.join(__dirname, "../admin")));

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/forkfleet";
mongoose.connect(MONGO_URI)
  .then(() => { console.log("✅ MongoDB connected successfully"); seedDatabase(); })
  .catch(err => { console.error("❌ MongoDB connection failed:", err.message); process.exit(1); });

const RAZORPAY_KEY_ID     = process.env.RAZORPAY_KEY_ID     || "rzp_test_YOUR_KEY_ID";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "YOUR_KEY_SECRET";
let razorpayInstance;
try {
  const Razorpay = require("razorpay");
  razorpayInstance = new Razorpay({ key_id: RAZORPAY_KEY_ID, key_secret: RAZORPAY_KEY_SECRET });
  console.log("✅ Razorpay initialized");
} catch { console.log("⚠️  Razorpay not installed — run: cd backend && npm install razorpay"); }

// SCHEMAS
const userSchema = new mongoose.Schema({ name:{type:String,required:true,trim:true}, email:{type:String,required:true,unique:true,lowercase:true}, password:{type:String,required:true}, phone:{type:String,default:""}, role:{type:String,enum:["customer","admin"],default:"customer"} },{ timestamps:true });
const menuItemSchema = new mongoose.Schema({ name:{type:String,required:true,trim:true}, category:{type:String,required:true,enum:["burger","pizza","sushi","salad","dessert"]}, price:{type:Number,required:true,min:0}, desc:{type:String,default:""}, image:{type:String,default:""}, time:{type:String,default:"20 min"}, cal:{type:Number,default:0}, badge:{type:String,default:null}, rating:{type:Number,default:0}, reviews:{type:Number,default:0}, available:{type:Boolean,default:true} },{ timestamps:true });
const orderSchema = new mongoose.Schema({
  orderId:{type:String,unique:true},
  items:[{ id:Number, name:String, price:Number, qty:Number, customizations:{ spice:{type:String,default:null}, extras:[String], portion:{type:String,default:null}, notes:{type:String,default:null} } }],
  total:{type:Number,default:0}, subtotal:{type:Number,default:0}, deliveryFee:{type:Number,default:2.99}, tax:{type:Number,default:0}, discount:{type:Number,default:0}, couponCode:{type:String,default:null},
  deliveryAddress:{type:String,default:"Not provided"}, customerName:{type:String,default:""}, customerPhone:{type:String,default:""}, customerEmail:{type:String,default:""}, notes:{type:String,default:""},
  userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",default:null},
  paymentMethod:{type:String,default:"cod"}, paymentId:{type:String,default:null}, paymentStatus:{type:String,default:"pending"},
  status:{type:String,enum:["pending","confirmed","preparing","out_for_delivery","delivered","cancelled"],default:"pending"}
},{ timestamps:true });
const reviewSchema = new mongoose.Schema({ itemId:{type:Number,required:true}, userId:{type:mongoose.Schema.Types.ObjectId,ref:"User",default:null}, user:{type:String,required:true}, avatar:{type:String,default:""}, rating:{type:Number,required:true,min:1,max:5}, text:{type:String,required:true}, date:{type:String,default:"Just now"} },{ timestamps:true });
const couponSchema = new mongoose.Schema({ code:{type:String,required:true,unique:true,uppercase:true}, type:{type:String,enum:["percent","flat","free_delivery"],required:true}, discount:{type:Number,default:0}, label:{type:String,default:""}, minOrder:{type:Number,default:0}, maxUses:{type:Number,default:999}, usedCount:{type:Number,default:0}, active:{type:Boolean,default:true}, expiresAt:{type:Date,default:null} },{ timestamps:true });

const User=mongoose.model("User",userSchema), MenuItem=mongoose.model("MenuItem",menuItemSchema), Order=mongoose.model("Order",orderSchema), Review=mongoose.model("Review",reviewSchema), Coupon=mongoose.model("Coupon",couponSchema);

async function seedDatabase() {
  try {
    if (!await User.findOne({ email:"admin@forkfleet.com" })) { await User.create({ name:"Admin User", email:"admin@forkfleet.com", password:await bcrypt.hash("admin123",10), role:"admin" }); console.log("✅ Admin created"); }
    if (await MenuItem.countDocuments()===0) {
      await MenuItem.insertMany([
        { name:"Smash Burger Deluxe", category:"burger", price:14.99, rating:4.9, reviews:312, time:"18 min", cal:720, badge:"🔥 Bestseller", desc:"Double smash patty, aged cheddar, secret sauce", image:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
        { name:"Truffle Margherita",  category:"pizza",  price:18.50, rating:4.8, reviews:214, time:"22 min", cal:890, badge:"⭐ Chef's Pick", desc:"San Marzano tomato, buffalo mozzarella, truffle oil", image:"https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80" },
        { name:"Dragon Roll",         category:"sushi",  price:22.00, rating:4.9, reviews:189, time:"25 min", cal:420, badge:"🌿 Fresh", desc:"Shrimp tempura, avocado, spicy tobiko", image:"https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&q=80" },
        { name:"Harvest Bowl",        category:"salad",  price:13.50, rating:4.7, reviews:156, time:"12 min", cal:380, badge:"💚 Healthy", desc:"Kale, quinoa, roasted veggies, lemon tahini", image:"https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80" },
        { name:"Crème Brûlée",        category:"dessert",price:9.99,  rating:5.0, reviews:98,  time:"10 min", cal:310, badge:"✨ New", desc:"Classic vanilla custard, caramelized sugar crust", image:"https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80" },
        { name:"BBQ Bacon Melt",      category:"burger", price:16.50, rating:4.8, reviews:274, time:"20 min", cal:850, badge:"🔥 Hot", desc:"Wagyu beef, smoked bacon, chipotle BBQ", image:"https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=400&q=80" },
        { name:"Pepperoni Supreme",   category:"pizza",  price:20.00, rating:4.7, reviews:301, time:"24 min", cal:960, badge:null, desc:"Thick crust, triple pepperoni, roasted garlic", image:"https://images.unsplash.com/photo-1548369937-47519962c11a?w=400&q=80" },
        { name:"Rainbow Roll",        category:"sushi",  price:24.50, rating:4.9, reviews:143, time:"28 min", cal:460, badge:"⭐ Popular", desc:"Tuna, salmon, yellowtail, seasonal fish", image:"https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=400&q=80" },
        { name:"Chocolate Lava Cake", category:"dessert",price:11.50, rating:4.9, reviews:267, time:"15 min", cal:490, badge:"🍫 Indulgent", desc:"Warm dark chocolate, vanilla gelato", image:"https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=400&q=80" },
      ]);
      console.log("✅ Menu seeded");
    }
    if (await Review.countDocuments()===0) {
      await Review.insertMany([
        { itemId:1, user:"Arjun K.",  avatar:"https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=60&q=80", rating:5, text:"The smash burger is absolutely insane. Crispy edges, melty cheese — 10/10 every time.", date:"2 days ago" },
        { itemId:2, user:"Meera S.",  avatar:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=80", rating:5, text:"Truffle Margherita is dreamy. Arrived piping hot and the truffle oil aroma was incredible.", date:"3 days ago" },
        { itemId:3, user:"Vikram P.", avatar:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=80", rating:4, text:"Dragon Roll was super fresh. Packaging kept it cold perfectly. Will order again!", date:"5 days ago" },
        { itemId:9, user:"Sneha R.",  avatar:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=80", rating:5, text:"The lava cake is DANGEROUS. So rich and warm, the gelato pairing is perfect.", date:"1 week ago" },
        { itemId:4, user:"Karan M.",  avatar:"https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=60&q=80", rating:4, text:"Harvest Bowl is my weekly go-to. Healthy, filling and actually delicious.", date:"1 week ago" },
        { itemId:6, user:"Priya T.",  avatar:"https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=80", rating:5, text:"BBQ Bacon Melt hit different. The chipotle sauce is a perfect smoky kick.", date:"2 weeks ago" },
      ]);
      console.log("✅ Reviews seeded");
    }
    if (await Coupon.countDocuments()===0) {
      await Coupon.insertMany([
        { code:"FIRSTBITE", type:"free_delivery", discount:0,    label:"Free Delivery!",  minOrder:0   },
        { code:"SAVE10",    type:"percent",        discount:0.10, label:"10% off!",        minOrder:200 },
        { code:"FLAT50",    type:"flat",           discount:50,   label:"₹50 off!",        minOrder:300 },
        { code:"WELCOME20", type:"percent",        discount:0.20, label:"20% off!",        minOrder:500 },
      ]);
      console.log("✅ Coupons seeded");
    }
    console.log("✅ Database ready");
  } catch(err) { console.error("Seed error:", err.message); }
}

const JWT_SECRET=process.env.JWT_SECRET||"forkfleet-secret-2025", ADMIN_JWT_SECRET=process.env.ADMIN_JWT_SECRET||"forkfleet-admin-2025";
const authMiddleware=(req,res,next)=>{ const t=req.headers.authorization?.split(" ")[1]; if(!t) return res.status(401).json({success:false,message:"No token"}); try{req.user=jwt.verify(t,JWT_SECRET);next();}catch{res.status(401).json({success:false,message:"Invalid token"});} };
const adminMiddleware=(req,res,next)=>{ const t=req.headers.authorization?.split(" ")[1]; if(!t) return res.status(401).json({success:false,message:"Admin token required"}); try{const d=jwt.verify(t,ADMIN_JWT_SECRET);if(d.role!=="admin")throw new Error();req.admin=d;next();}catch{res.status(403).json({success:false,message:"Admin access denied"});} };
function generateOrderId(){
  // Timestamp + random suffix avoids collisions from deletes and concurrent requests.
  const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
  const rand = crypto.randomInt(0, 1000000).toString().padStart(6, "0");
  return `ORD-${stamp}-${rand}`;
}

// HEALTH
app.get("/api/health",(req,res)=>res.json({status:"ok",db:mongoose.connection.readyState===1?"connected":"disconnected"}));

// AUTH
app.post("/api/auth/register",async(req,res)=>{ try{ const{name,email,password,phone}=req.body; if(!name||!email||!password) return res.status(400).json({success:false,message:"Name, email and password required"}); if(password.length<6) return res.status(400).json({success:false,message:"Password must be at least 6 characters"}); if(await User.findOne({email:email.toLowerCase()})) return res.status(409).json({success:false,message:"Email already registered"}); const user=await User.create({name:name.trim(),email:email.toLowerCase(),password:await bcrypt.hash(password,10),phone:phone||"",role:"customer"}); const token=jwt.sign({id:user._id,email:user.email,role:user.role},JWT_SECRET,{expiresIn:"7d"}); res.json({success:true,token,user:{id:user._id,name:user.name,email:user.email,phone:user.phone,role:user.role}}); }catch(err){res.status(500).json({success:false,message:err.message});} });
app.post("/api/auth/login",async(req,res)=>{ try{ const{email,password}=req.body; if(!email||!password) return res.status(400).json({success:false,message:"Email and password required"}); const user=await User.findOne({email:email.toLowerCase(),role:"customer"}); if(!user||!await bcrypt.compare(password,user.password)) return res.status(401).json({success:false,message:"Invalid email or password"}); const token=jwt.sign({id:user._id,email:user.email,role:user.role},JWT_SECRET,{expiresIn:"7d"}); res.json({success:true,token,user:{id:user._id,name:user.name,email:user.email,phone:user.phone,role:user.role}}); }catch(err){res.status(500).json({success:false,message:err.message});} });
app.post("/api/admin/login",async(req,res)=>{ try{ const{email,password}=req.body; const admin=await User.findOne({email:email.toLowerCase(),role:"admin"}); if(!admin||!await bcrypt.compare(password,admin.password)) return res.status(401).json({success:false,message:"Invalid admin credentials"}); const token=jwt.sign({id:admin._id,email:admin.email,role:"admin",name:admin.name},ADMIN_JWT_SECRET,{expiresIn:"8h"}); res.json({success:true,token,admin:{id:admin._id,name:admin.name,email:admin.email}}); }catch(err){res.status(500).json({success:false,message:err.message});} });
app.get("/api/admin/me",adminMiddleware,async(req,res)=>{ try{ const admin=await User.findById(req.admin.id).select("-password"); if(!admin) return res.status(404).json({success:false,message:"Not found"}); res.json({success:true,admin:{id:admin._id,name:admin.name,email:admin.email}}); }catch(err){res.status(500).json({success:false,message:err.message});} });

// MENU
app.get("/api/menu",async(req,res)=>{ try{ const{category,search}=req.query; const q={available:true}; if(category&&category!=="all") q.category=category; if(search) q.$or=[{name:{$regex:search,$options:"i"}},{desc:{$regex:search,$options:"i"}}]; const items=await MenuItem.find(q).sort({createdAt:1}); res.json({success:true,items:items.map((item,i)=>({...item.toObject(),id:i+1}))}); }catch(err){res.status(500).json({success:false,message:err.message});} });
app.get("/api/admin/menu",adminMiddleware,async(req,res)=>{ try{ const items=await MenuItem.find().sort({createdAt:1}); res.json({success:true,items:items.map((item,i)=>({...item.toObject(),id:i+1}))}); }catch(err){res.status(500).json({success:false,message:err.message});} });
app.post("/api/admin/menu",adminMiddleware,async(req,res)=>{ try{ const{name,category,price,desc,image,time,cal,badge,available}=req.body; if(!name||!category||!price) return res.status(400).json({success:false,message:"Name, category and price required"}); const item=await MenuItem.create({name:name.trim(),category,price:parseFloat(price),desc:desc||"",image:image||"",time:time||"20 min",cal:parseInt(cal)||0,badge:badge||null,available:available!==false}); const count=await MenuItem.countDocuments(); res.status(201).json({success:true,item:{...item.toObject(),id:count}}); }catch(err){res.status(500).json({success:false,message:err.message});} });
app.put("/api/admin/menu/:id",adminMiddleware,async(req,res)=>{ try{ const fields=["name","category","price","desc","image","time","cal","badge","available"]; const update={}; fields.forEach(f=>{if(req.body[f]!==undefined)update[f]=req.body[f];}); if(update.price!==undefined)update.price=parseFloat(update.price); if(update.cal!==undefined)update.cal=parseInt(update.cal); const item=await MenuItem.findByIdAndUpdate(req.params.id,update,{new:true}); if(!item) return res.status(404).json({success:false,message:"Item not found"}); res.json({success:true,item}); }catch(err){res.status(500).json({success:false,message:err.message});} });
app.delete("/api/admin/menu/:id",adminMiddleware,async(req,res)=>{ try{ const item=await MenuItem.findByIdAndDelete(req.params.id); if(!item) return res.status(404).json({success:false,message:"Item not found"}); res.json({success:true,message:"Item deleted"}); }catch(err){res.status(500).json({success:false,message:err.message});} });
app.patch("/api/admin/menu/:id/toggle",adminMiddleware,async(req,res)=>{ try{ const item=await MenuItem.findById(req.params.id); if(!item) return res.status(404).json({success:false,message:"Item not found"}); item.available=!item.available; await item.save(); res.json({success:true,item}); }catch(err){res.status(500).json({success:false,message:err.message});} });

// PAYMENT - Razorpay
app.post("/api/payment/create-order",async(req,res)=>{ try{ if(!razorpayInstance) return res.status(500).json({success:false,message:"Razorpay not configured. Run: npm install razorpay"}); const{amount,currency="INR"}=req.body; if(!amount||amount<=0) return res.status(400).json({success:false,message:"Valid amount required"}); const order=await razorpayInstance.orders.create({amount:Math.round(amount*100),currency,receipt:`receipt_${Date.now()}`}); console.log("💳 Razorpay order created:",order.id); res.json({success:true,order,keyId:RAZORPAY_KEY_ID}); }catch(err){console.error("Razorpay error:",err.message);res.status(500).json({success:false,message:err.message});} });
app.post("/api/payment/verify",async(req,res)=>{ try{ const{razorpay_order_id,razorpay_payment_id,razorpay_signature}=req.body; const expected=crypto.createHmac("sha256",RAZORPAY_KEY_SECRET).update(razorpay_order_id+"|"+razorpay_payment_id).digest("hex"); if(expected!==razorpay_signature) return res.status(400).json({success:false,message:"Payment verification failed"}); console.log("✅ Payment verified:",razorpay_payment_id); res.json({success:true,paymentId:razorpay_payment_id}); }catch(err){res.status(500).json({success:false,message:err.message});} });

// COUPONS
app.post("/api/coupons/validate",async(req,res)=>{ try{ const{code,subtotal=0}=req.body; if(!code) return res.status(400).json({success:false,message:"Coupon code required"}); const coupon=await Coupon.findOne({code:code.trim().toUpperCase(),active:true}); if(!coupon) return res.status(404).json({success:false,message:"Invalid coupon code"}); if(coupon.expiresAt&&new Date()>coupon.expiresAt) return res.status(400).json({success:false,message:"Coupon has expired"}); if(coupon.usedCount>=coupon.maxUses) return res.status(400).json({success:false,message:"Coupon usage limit reached"}); if(subtotal<coupon.minOrder) return res.status(400).json({success:false,message:`Minimum order ₹${coupon.minOrder} required`}); res.json({success:true,coupon:{code:coupon.code,type:coupon.type,discount:coupon.discount,label:coupon.label}}); }catch(err){res.status(500).json({success:false,message:err.message});} });
app.get("/api/admin/coupons",adminMiddleware,async(req,res)=>{ try{ const coupons=await Coupon.find().sort({createdAt:-1}); res.json({success:true,coupons}); }catch(err){res.status(500).json({success:false,message:err.message});} });
app.post("/api/admin/coupons",adminMiddleware,async(req,res)=>{ try{ const{code,type,discount,label,minOrder,maxUses,expiresAt}=req.body; if(!code||!type) return res.status(400).json({success:false,message:"Code and type required"}); if(await Coupon.findOne({code:code.toUpperCase()})) return res.status(409).json({success:false,message:"Coupon code already exists"}); const coupon=await Coupon.create({code:code.toUpperCase().trim(),type,discount:parseFloat(discount)||0,label:label||`${code} discount`,minOrder:parseFloat(minOrder)||0,maxUses:parseInt(maxUses)||999,expiresAt:expiresAt?new Date(expiresAt):null}); res.status(201).json({success:true,coupon}); }catch(err){res.status(500).json({success:false,message:err.message});} });
app.patch("/api/admin/coupons/:id/toggle",adminMiddleware,async(req,res)=>{ try{ const coupon=await Coupon.findById(req.params.id); if(!coupon) return res.status(404).json({success:false,message:"Coupon not found"}); coupon.active=!coupon.active; await coupon.save(); res.json({success:true,coupon}); }catch(err){res.status(500).json({success:false,message:err.message});} });
app.delete("/api/admin/coupons/:id",adminMiddleware,async(req,res)=>{ try{ await Coupon.findByIdAndDelete(req.params.id); res.json({success:true,message:"Coupon deleted"}); }catch(err){res.status(500).json({success:false,message:err.message});} });

// ORDERS
app.post("/api/orders",async(req,res)=>{ try{
  console.log("📦 Order from:", req.body.customerName, "| Total:", req.body.total);
  const{items,total,subtotal,deliveryFee,tax,discount,couponCode,deliveryAddress,customerName,customerPhone,customerEmail,notes,userId,paymentMethod,paymentId,paymentStatus}=req.body;
  if(!items||!Array.isArray(items)||items.length===0) return res.status(400).json({success:false,message:"Order must have items"});
  let parsedUserId=null; if(userId){try{parsedUserId=new mongoose.Types.ObjectId(userId);}catch{parsedUserId=null;}}
  const baseOrderPayload={items,total:parseFloat(total)||0,subtotal:parseFloat(subtotal)||0,deliveryFee:parseFloat(deliveryFee)??2.99,tax:parseFloat(tax)||0,discount:parseFloat(discount)||0,couponCode:couponCode||null,deliveryAddress:deliveryAddress||"Not provided",customerName:customerName||"",customerPhone:customerPhone||"",customerEmail:customerEmail||"",notes:notes||"",userId:parsedUserId,paymentMethod:paymentMethod||"cod",paymentId:paymentId||null,paymentStatus:paymentStatus||"pending",status:"pending"};

  let order=null;
  for(let attempt=0;attempt<5;attempt++){
    try{
      order=await Order.create({orderId:generateOrderId(),...baseOrderPayload});
      break;
    }catch(createErr){
      // Retry only unique collisions on orderId.
      if(createErr?.code===11000&&createErr?.keyPattern?.orderId){
        continue;
      }
      throw createErr;
    }
  }

  if(!order){
    return res.status(503).json({success:false,message:"Could not generate a unique order ID. Please retry."});
  }

  if(couponCode) await Coupon.findOneAndUpdate({code:couponCode},{$inc:{usedCount:1}});
  console.log("✅ Saved:", order.orderId, "| Payment:", paymentStatus);
  res.status(201).json({success:true,order:{...order.toObject(),id:order.orderId}});
}catch(err){console.error("❌ Order error:",err.message);res.status(500).json({success:false,message:err.message});} });

app.get("/api/orders/my",async(req,res)=>{ try{ const{userId}=req.query; if(!userId) return res.status(400).json({success:false,message:"userId required"}); let parsedId=null; try{parsedId=new mongoose.Types.ObjectId(userId);}catch{} const query=parsedId?{$or:[{userId:parsedId},{userId:userId}]}:{userId:userId}; const orders=await Order.find(query).sort({createdAt:-1}); const seen=new Set(); const unique=orders.filter(o=>{if(seen.has(o.orderId))return false;seen.add(o.orderId);return true;}); console.log("📋 Orders for",userId,"→",unique.length,"found"); res.json({success:true,orders:unique.map(o=>({...o.toObject(),id:o.orderId}))}); }catch(err){res.status(500).json({success:false,message:err.message});} });
app.get("/api/orders/:orderId",async(req,res)=>{ try{ const order=await Order.findOne({orderId:req.params.orderId}); if(!order) return res.status(404).json({success:false,message:"Order not found"}); res.json({success:true,order:{...order.toObject(),id:order.orderId}}); }catch(err){res.status(500).json({success:false,message:err.message});} });
app.delete("/api/admin/orders/:id",adminMiddleware,async(req,res)=>{ try{ const order=await Order.findOneAndDelete({orderId:req.params.id}); if(!order) return res.status(404).json({success:false,message:"Order not found"}); res.json({success:true,message:"Order deleted"}); }catch(err){res.status(500).json({success:false,message:err.message});} });
app.get("/api/admin/orders",adminMiddleware,async(req,res)=>{ try{ const orders=await Order.find().sort({createdAt:-1}); const seen=new Set(); const unique=orders.filter(o=>{if(seen.has(o.orderId))return false;seen.add(o.orderId);return true;}); res.json({success:true,orders:unique.map(o=>({...o.toObject(),id:o.orderId}))}); }catch(err){res.status(500).json({success:false,message:err.message});} });
app.patch("/api/admin/orders/:id/status",adminMiddleware,async(req,res)=>{ try{ const{status}=req.body; const valid=["pending","confirmed","preparing","out_for_delivery","delivered","cancelled"]; if(!valid.includes(status)) return res.status(400).json({success:false,message:"Invalid status"}); const order=await Order.findOneAndUpdate({orderId:req.params.id},{status},{new:true}); if(!order) return res.status(404).json({success:false,message:"Order not found"}); res.json({success:true,order:{...order.toObject(),id:order.orderId}}); }catch(err){res.status(500).json({success:false,message:err.message});} });

// REVIEWS
app.get("/api/reviews",async(req,res)=>{ try{ const q=req.query.itemId?{itemId:parseInt(req.query.itemId)}:{}; const reviews=await Review.find(q).sort({createdAt:-1}); res.json({success:true,reviews}); }catch(err){res.status(500).json({success:false,message:err.message});} });
app.post("/api/reviews",async(req,res)=>{ try{ const{itemId,user,text,rating,avatar}=req.body; if(!itemId||!user||!text||!rating) return res.status(400).json({success:false,message:"Missing required fields"}); const review=await Review.create({itemId:parseInt(itemId),user:user.trim(),avatar:avatar||`https://ui-avatars.com/api/?name=${encodeURIComponent(user)}&background=F4A435&color=0A0A0A&size=60`,rating:parseInt(rating),text:text.trim(),date:"Just now"}); res.status(201).json({success:true,review}); }catch(err){res.status(500).json({success:false,message:err.message});} });
app.get("/api/admin/reviews",adminMiddleware,async(req,res)=>{ try{ const reviews=await Review.find().sort({createdAt:-1}); const menuItems=await MenuItem.find().sort({createdAt:1}); const enriched=reviews.map(r=>({...r.toObject(),itemName:menuItems[r.itemId-1]?.name||"Unknown Item"})); res.json({success:true,reviews:enriched}); }catch(err){res.status(500).json({success:false,message:err.message});} });
app.delete("/api/admin/reviews/:id",adminMiddleware,async(req,res)=>{ try{ const review=await Review.findByIdAndDelete(req.params.id); if(!review) return res.status(404).json({success:false,message:"Review not found"}); res.json({success:true,message:"Review deleted"}); }catch(err){res.status(500).json({success:false,message:err.message});} });

// USERS
app.get("/api/admin/users",adminMiddleware,async(req,res)=>{ try{ const users=await User.find({role:"customer"}).select("-password").sort({createdAt:-1}); res.json({success:true,users}); }catch(err){res.status(500).json({success:false,message:err.message});} });
app.delete("/api/admin/users/:id", adminMiddleware, async (req, res) => {
  try {
    const id = req.params.id;

    if (!id || id === "undefined") {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID format" });
    }

    const user = await User.findOneAndDelete({ _id: id, role: "customer" });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// STATS
app.get("/api/admin/stats",adminMiddleware,async(req,res)=>{ try{ const[totalOrders,totalUsers,totalMenuItems,totalReviews,allOrders,allReviews,topItems,recentOrders]=await Promise.all([Order.countDocuments(),User.countDocuments({role:"customer"}),MenuItem.countDocuments(),Review.countDocuments(),Order.find(),Review.find(),MenuItem.find({available:true}).sort({reviews:-1}).limit(5),Order.find().sort({createdAt:-1}).limit(5)]); const totalRevenue=allOrders.reduce((s,o)=>s+(o.total||0),0); const avgRating=allReviews.length?(allReviews.reduce((s,r)=>s+r.rating,0)/allReviews.length).toFixed(1):"0.0"; const seen=new Set(); const unique=recentOrders.filter(o=>{if(seen.has(o.orderId))return false;seen.add(o.orderId);return true;}); res.json({success:true,stats:{totalOrders,totalRevenue:totalRevenue.toFixed(2),totalUsers,totalMenuItems,totalReviews,avgRating,recentOrders:unique.map(o=>({...o.toObject(),id:o.orderId})),topItems:topItems.map((item,i)=>({...item.toObject(),id:i+1}))}}); }catch(err){res.status(500).json({success:false,message:err.message});} });

const PORT=process.env.PORT||5000;
app.listen(PORT,()=>{ console.log(`🚀 Fork.Fleet API running on http://localhost:${PORT}`); console.log(`🛠️  Admin panel: http://localhost:${PORT}/admin`); });
