<template>
  <div class="card" id="help">
    <h2>On amounts computation</h2>
    <p>
      Amounts are computed in the following way: the <strong>balance</strong> is
      <em>positive</em> if the overall income is net positive, and is <em>negative</em> if there are
      more expenses than incomes; the <strong>single transaction amount</strong> is computed so that
      an expense has <em>positive</em> sign, and an income has <em>negative</em> sign. This is done
      so that, if you want to perform a refund, you have to assign a negative value to the recipient
      and a positive value to yourself (it's an expense for you and an income for them).
    </p>

    <h2>Search filters tips</h2>
    <p>user: filters a given user</p>
    <p>year: filters with a given year</p>
    <p>month: filters with a given month</p>
    <p>date: on format 'YYYY-MM-DD', filters with given date</p>
  </div>
</template>
