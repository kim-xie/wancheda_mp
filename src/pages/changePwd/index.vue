<template>
    <div class="container">
        <div class="changePwd">
            <p class="input_wrap">
                <span class="input_label">原密码</span>
                <input v-model="oldpassword" type="password" autofocus placeholder="请输入原密码" maxlength="20"/>
            </p>
            <p class="input_wrap">
                <span class="input_label">新密码</span>
                <input v-model="newpassword" type="password" title="新密码" placeholder="请输入新密码" maxlength="20"/>
            </p>
            <p class="input_wrap">
                <span class="input_label">确认密码</span>
                <input v-model="confirmpassword" type="password" title="确认密码" placeholder="请输入确认密码" maxlength="20" />
            </p>
            <button class="save" @click="handleSave">保 存</button>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            oldpassword: '',
            newpassword: '',
            confirmpassword: '',
        }
    },
    created () {

    },
    methods: {
        // 保存
        handleSave(){
            console.log(this.oldpassword)
            console.log(this.newpassword)
            console.log(this.confirmpassword)
        }
    }
}
</script>

<style lang="scss" scoped>
    .changePwd{
        width: 100%;
        .input_wrap{
            width: 90%;
            margin: 10px auto;
            height: 78rpx;
            line-height: 78rpx;
            border: $--border-base;
            border-radius: $--border-radius-base;
            padding: 0 10px;
            .input_label{
                float: left;
                display: block;
                width: 100px;
                font-size: 18px;
            }
            input{
                width: calc(100% - 106px);
                height: 100%;
                line-height: 70rpx;
            }
        }
        .save{
            width: 95%;
            margin: 0 auto;
            height: 80rpx;
            line-height: 80rpx;
            margin-top: 18px;
            background-color: $--color-primary;
            box-shadow:0 0 10rpx $--color-primary;
            color: $--color-white;
            font-size: 36rpx;
        }
    }
</style>
