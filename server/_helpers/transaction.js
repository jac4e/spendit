import db from './db.js';
import accountService from '../account/service.js';

const Transaction = db.transaction;

async function create(transactionParam) {
    // should store entire account and products in transaction incase product or user is deleted
    // this way proper invoices can still be generated

    // check total type
    if (typeof transactionParam.total !== 'string') {
        transactionParam.total = BigInt(transactionParam.total).toString()
    }

    // Check if username valid
    if (await accountService.getById(transactionParam.accountid)) {
        // valid
    } else {
        throw `Account by ID '${transactionParam.accountid}' is not in database`
    }

    // Check type

    if (!(transactionParam.type === 'debit' || transactionParam.type === 'credit')) {
        throw `Transaction type must be 'credit' or 'debit'`
    }

    const transaction = new Transaction(transactionParam)

    await transaction.save()
}

async function getAll() {
    return await Transaction.find({}).sort({
        date: -1
    }).lean();
}


async function getById(id) {
    // console.log(`get trans by id: ${id}`)
    test = await Transaction.findById(id);
    // console.log(test);
    return test;
}

async function getByDate(date) {

}

async function getBalanceByAccountId(accountid) {
    return await Transaction.aggregate([{
        $match: {
            accountid: accountid
        }
    }, {
        $group: {
            _id: null,
            balance: {
                $sum: {
                    $cond: [{
                        $eq: ['$type', 'debit']
                    }, {
                        '$toLong': '$total'
                    }, {
                        $multiply: [{
                            '$toLong': '$total'
                        }, -1]
                    }]
                }
            }
        }
    }])
}

async function getByAccountId(accountid) {
    // console.log(`get trans by id: ${accountid}`);
    return await Transaction.find({
        accountid: accountid
    }).sort({
        date: -1
    }).lean();

}

async function getByType(type) {

}

async function getByReason(reason) {

}

async function getByProduct(product) {

}


async function getByAmount(amount) {

}

export default {
    create,
    getAll,
    getById,
    getByAccountId,
    getBalanceByAccountId
}