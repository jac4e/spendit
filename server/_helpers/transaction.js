import db from './db.js';
import validator from 'validator';

const Transaction = db.transaction;
const User = db.User

async function create(transactionParam) {
    // Check if ccid valid
    if (await User.findOne({
        ccid: transactionParam.ccid
    })) {
        // valid
    } else {
        throw `CCID '${ccid}' is not in database`
    }

    // Check type

    if (!(transactionParam.type === 'debit' || transactionParam.type === 'credit')) {
        throw `Transaction type must be 'credit' or 'debit'`
    }

    const transaction = new Transaction(transactionParam)
    
    // stamp date
    transaction.date = Date.now()

    await transaction.save()
}

async function getByDate(date){

}

async function getByCCID(ccid){

}

async function getByType(type){

}

async function getByReason(reason){

}

async function getByProduct(product){

}


async function getByAmount(amount){

}

export default { create }
