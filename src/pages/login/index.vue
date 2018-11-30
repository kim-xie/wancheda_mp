<template>
    <div class="container">
        <div class="login_box">
            <div class="login_logo">
                <p class="logo"><h3>万车达</h3></p>
            </div>
            <div class="login_form">
                <form action="javascript:;">
                    <div class="form-item form_username">
                        <i class="iconfont icon-user"></i>
                        <input :v-model="form.username" class="form-input" type="text" placeholder="请输入用户名">
                    </div>
                    <div class="form-item form_password mt40">
                        <i class="iconfont icon-password"></i>
                        <input :v-model="form.password" class="form-input" type="password" placeholder="请输入密码">
                    </div>
                    <div class="form_btn mt60">
                        <a href="javascript:;" @tap="login">登 录</a>
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
export default {
    data () {
        return {
            form: {}
        }
    },
    created () {

    },
    methods: {
        // 登录
        login(){
            const username = this.form.username;
            const password = this.form.password;
        }
    },
}
</script>

<style lang="scss" scoped>
    .form-item{
        display: flex;
        height: 84rpx;
        line-height: 84rpx;
        border-bottom: 4rpx solid #c8e4fe;
    }
    .iconfont{
        font-size: 60rpx;
        color: #c8e4fe;
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
            color: #a5aeff;
        }
        .login_form{
            width: 100%;
            .form_btn{
                width: 100%;
                height: 80rpx;
                line-height: 80rpx;
                border-radius: 12rpx;
                text-align: center;
                background-color: #6b76ff;
                box-shadow:0 0 10rpx #6b76ff;
                a{
                    color: #fff;
                    font-size: 36rpx;
                }
            }
            .form_other{
                display: flex;
                flex-direction: row;
                height: 90rpx;
                line-height: 90rpx;
                a{
                    display: block;
                    width: 50%;
                    font-size: 32rpx;
                    color: #c0c0c0;
                }
            }
        }
    }
</style>
