import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '../config.js';
import db from '../_helpers/db.js';

const Account = db.account;
const secret = config.secret;

async function auth({
  ccid,
  password
}) {
  const account = await Account.findOne({
    ccid: ccid
  });
  const match = await bcrypt.compare(password, account.hash)
  if (account && match) {
    const token = jwt.sign({
      sub: account.id,
      permissions: account.roles
    }, secret, {
      expiresIn: '7d'
    })
    account.balance = await getBalance(account.id);
    return {
      ...account.toJSON(),
      token
    }
  } else {
    throw `Auth error username or password is incorrect`
  }
}

async function create(accountParam) {
  // validate
  console.log(JSON.stringify(accountParam))
  if (await Account.findOne({
      ccid: accountParam.ccid
    })) {
    throw `CCID '${accountParam.ccid}' is already taken`
  }
  const account = new Account(accountParam)
  // hash password
  if (accountParam.password) {
    account.hash = bcrypt.hashSync(accountParam.password, 10);
  }
  // save account
  await account.save()
}

// async function search({
//   type,
//   query,
//   sortBy,
//   limit,
//   page
// }) {
//   //sortBy is object composed of {field: 'order'}
//   console.log(type, query, sortBy, limit, page)
//   let searchParam = {}
//   searchParam[type] = query;
//   let results = await Account.find(searchParam).sort(sortBy).skip(parseInt(page) * parseInt(limit)).limit(parseInt(limit))
//   console.log(results)
//   const count = await Account.countDocuments(query)
//   return {
//     results: results,
//     total: count,
//     page: page,
//     pageSize: results.length
//   }
// }

// Private account functions

async function getBalance(id){
  // transaction based balance
  console.log(`id: ${id}`)
  const res = await transaction.getBalanceByAccountId(id)
  console.log(res)

  // if no transactions, balance is 0
  if (res.length === 0){
    return 0;
  }
  return res[0].balance;
}

async function resetSession(id) {
  let account = await Account.findById(id);
  account.sessionid = randomUUID();
  await account.save();
  return;
}

async function getAll() {
  return await Account.find({});
}

async function getSelf(jwt) {
  return await Account.findById(id);
}

async function getById(id) {
  return await Account.findById(id);
}

async function pay(jwt) {
  // get account by JWT
}

export default {
  auth,
  create,
  getAll,
  getById,
  getBalance,
  pay
  // search
}