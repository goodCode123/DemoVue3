<script setup>
 
</script>

<template>
 <body>
    <div class="container">
        <h1>404</h1>
        <h2>找不到頁面</h2>
        <p>對不起，您要查找的頁面可能已被刪除、更名，或暫時不可用。</p>
        <p><a href="/">返回首頁</a></p>
    </div>
</body>
</template>

<style scoped>
  body {
            font-family: Arial, sans-serif;
            background-color: #f0f0f0;
            color: #333;
            text-align: center;
            padding: 50px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background: #fff;
            padding: 30px;
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;
        }
        h1 {
            font-size: 100px;
            margin: 0;
            color: #e74c3c;
        }
        h2 {
            margin: 10px 0;
            font-size: 24px;
        }
        p {
            font-size: 18px;
            line-height: 1.6;
        }
        a {
            text-decoration: none;
            color: #3498db;
            font-weight: bold;
        }
        a:hover {
            text-decoration: underline;
        }
</style>