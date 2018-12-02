<template>
    <div class="container">
        <!-- iview 全局提示组件 -->
        <i-message id="message"/>
        <div class="login_box">
            <div class="login_logo">
                <p class="logo"><h3>万车达</h3></p>
            </div>
            <div class="login_form">
                <form>
                    <div class="form-item form_username">
                        <i class="iconfont icon-user"></i>
                        <input v-model="form.username" class="form-input" type="text" @keyup.enter.native="login" placeholder="请输入用户名">
                    </div>
                    <div class="form-item form_password mt40">
                        <i class="iconfont icon-password"></i>
                        <input v-model="form.password" class="form-input" type="password"  @keyup.enter.native="login" placeholder="请输入密码">
                    </div>
                    <div class="form_btn mt60">
                        <div @tap="login">登 录</div>
                    </div>
                    <div class="form_other">
                        <a href="javascript:;" class="text-left">立即注册</a>
                        <a href="javascript:;" class="text-right">忘记密码?</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import globe from '../../utils/globe'

export default {
    data () {
        return {
            form: {
                username: 'kim',
                password: '123456'
            }
        }
    },
    created () {

    },
    methods: {
        // 登录
        login(){
            const username = this.form.username
            const password = this.form.password
            console.log(username +"--" + password )
            this.$http.post('/login',{username,password}).then(res => {
                console.log(res)
                if(res.code === 200){
                    globe.message(res.msg,'success')
                    setTimeout(() => {
                        wx.navigateTo({
                            url: '../../pages/index/main'
                        })
                    }, 3000)
                }else{
                    globe.message(res.msg,'warning')
                }
            }).catch(err => {
                globe.message('网络请求错误，请稍后重试!','error')
            })
        }
    },
}
</script>

<style lang="scss" scoped>
    .form-item{
        display: flex;
        height: 84rpx;
        line-height: 84rpx;
        border-bottom: 4rpx solid $--color-text-placeholder;
    }
    .iconfont{
        font-size: 60rpx;
        color: $--color-text-placeholder;
    }
    .form-input{
        flex-grow: 1;
        align-self: center;
        margin: 30rpx 0;
        font-size: 32rpx;
    }
    .login_box{
        height: 100%;
        width: 50vh;
        .login_logo{
            height: 200rpx;
            line-height: 200rpx;
            text-align: center;
            font-size: 60rpx;
            color: $--color-primary;
        }
        .login_form{
            width: 100%;
            .form_btn{
                width: 100%;
                height: 80rpx;
                line-height: 80rpx;
                border-radius: 12rpx;
                text-align: center;
                background-color: $--color-primary;
                box-shadow:0 0 10rpx $--color-primary;
                div{
                    color: $--color-white;
                    font-size: 36rpx;
                }
            }
            .form_other{
                display: flex;
                flex-direction: row;
                height: 100rpx;
                line-height: 100rpx;
                a{
                    display: block;
                    width: 50%;
                    font-size: 32rpx;
                    color: $--color-text-placeholder;
                }
            }
        }
    }
</style>
