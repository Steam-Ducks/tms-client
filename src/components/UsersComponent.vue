<script setup lang="ts">
    
</script>

<template>
  <div class="user-control">
    <div class="head">
      <h2> Usuários </h2>    
      <a href="#">
        <div class="add-button"> Adicionar </div>
      </a>
    </div>
    <div class="header-line"></div>
    <div class="body">
      <div class="user-card">
        <div class="card-info">
          <div class="user-name">Giuliano Bertoti</div>
          <div class="user-role">Cargo 2</div>
        </div>
        <div class="card-actions">
          <a href="#">
            <div class="edit-button"> Editar </div>
          </a>  
          <a href="#">
            <div class="delete-button"> Excluir </div>
          </a>
        </div>
      </div>
      <div class="user-card">
        <div class="card-info">
          <div class="user-name">Giuliano Bertoti</div>
          <div class="user-role">Cargo 2</div>
        </div>
        <div class="card-actions">
          <a href="#">
            <div class="edit-button"> Editar </div>
          </a>  
          <a href="#">
            <div class="delete-button"> Excluir </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .user-control {
    width: 100%;
    border-radius: 16px;
    background-color: #1d1d1d90;
    padding-bottom: 20px;
  }

  .user-control h2 {
    color: #fff;
    padding: 20px;
    margin-left: 20px;
  }

  .header-line {
    border: 1px solid #444;
    width: 96%;
    margin: 0 auto 20px auto;
  }
  .head{
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .add-button{
    background-color: #00BF634D;
    color: white;
    padding: 8px 16px;
    border-radius: 8px;
    margin-left: auto;
    margin-right: 20px;
    cursor: pointer;
  }
  .user-card{
    display: flex;
    padding: 12px 20px;
    margin: 0 20px 12px 20px;
    font-size: 18px;
    color: white;
  }
  .card-info{
    width: 70%;
    text-align: left;
  }
  .card-actions{
    width: 30%;
    text-align: right;
    display: flex;
  }
  .user-role{
    color: #bdbdbd;
    font-size: 14px;
  }
</style>
