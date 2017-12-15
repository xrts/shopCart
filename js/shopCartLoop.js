new Vue({
    el:"#app",
    data:{
        //购物车中的数据
        shopListArr:[],
        //是否全选
        isSelectedAll:false,
        //所有商品的总价格
        totalPrice:0,
        //当前要删除的一个商品
        currentDelShop:{}
    },
    //组件已经加载完毕请求网络数据，业务处理
    mounted(){
        //请求本地数据
        this.getLocalData()

    },
    //过滤
    filters:{
      //格式化金钱
      moneyFormat(money){
          return "￥" + money.toFixed(2);
      }
    },
    methods:{
        //1、请求本地数据
        getLocalData(){
            this.$http.get('data/shop.json').then(response => {
                const res = response.body;
                if(res){
                    this.shopListArr = res.allShops.shopList;
                    //console.log(this.shopListArr);
                }
            },response =>{
                alert('请求数据失败')
            });
        },

        //2、单个商品的加减
        singerShopPrice(shop,flag){
            if(flag){//加
                shop.shopNumber +=1;
            }else{//减
                if(shop.shopNumber<=1){
                    shop.shopNumber=1;
                    return;
                }
                shop.shopNumber -= 1;
            }
            //计算总价
            this.getAllShopPrice();


        },
        //3、选中所有商品
        selectedAll(flag){
            //3.1 总控制
            this.isSelectedAll=!flag;
            //3.2 遍历所有商品数据
            this.shopListArr.forEach((value,index)=>{
                if(typeof  value.checked==='undefined'){
                    this.$set(value,'checked',!flag)
                }else {
                    value.checked=!flag;
                }
            })
            //3.3 计算总价格
            this.getAllShopPrice();




        },
        //4、计算商品总价
        getAllShopPrice(){
            let totalPrice=0;
            this.shopListArr.forEach((value,index)=>{
                //判断商品是否被选中
                if(value.checked){
                    totalPrice +=value.shopPrice*value.shopNumber
                }

            })
            this.totalPrice=totalPrice;
        },
        //5、单个商品选中
        singerShopSelected(shop){
            if(typeof  shop.checked==='undefined'){
                this.$set(shop,'checked',true)
            }else {
                shop.checked=!shop.checked;
            }
            //计算总价
            this.getAllShopPrice();

            //判断是否全选
            this.hasSelectedAll()
        },
        //6、判断是否全选
        hasSelectedAll(){
            let flag=true;
            this.shopListArr.forEach((value,index)=>{
                if(!value.checked){
                   flag = false
                }
            });
            this.isSelectedAll=flag;
        },
        //7、点击删除按钮
        clickTrash(shop){
            this.currentDelShop=shop;
        },

        //8、删除商品
        deleteShop(){

            const index = this.shopListArr.indexOf(this.currentDelShop)
            this.shopListArr.splice(index,1);
        }



    },
});