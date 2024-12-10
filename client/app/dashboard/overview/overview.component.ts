import { Component } from '@angular/core';
import { AdminService, StoreService } from 'client/app/_services';
import { RefillMethods, RefillStatus, Roles, TransactionType } from 'typesit';

interface Rank {
  place: number;
  name: string;
  amount: number;
};

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.sass']
})
export class OverviewComponent {
  storeStats: {
    mostPopular: Rank[];
    leastPopular: Rank[];
    biggestSpenders: Rank[];
  } | null = null;

  accountStats: {
    total: number;
    unverified: number;
    nonMembers: number;
    members: number;
    admins: number;
  } | null = null;

  financeStats: {
    totalCredit: number;
    revenue: number;
    creditBalance: number;
    costOfGoodsSold: number;
    profit: number;
  } | null = null;

  inventoryStats: {
    total: number;
    inStock: number;
    outOfStock: number;
    bookValue: number;
    retailValue: number;
  } | null = null;

  refillStats: {
    [key in RefillStatus]: number;
  } | null = null;

  constructor(
    private adminService: AdminService,
    private storeService: StoreService,
  ) {
    this.adminService.getAllAccounts().subscribe(accounts => {
      this.accountStats = {
        total: accounts.length,
        unverified: accounts.filter(account => account.role === Roles.Unverified).length,
        nonMembers: accounts.filter(account => account.role === Roles.NonMember).length,
        members: accounts.filter(account => account.role === Roles.Member).length,
        admins: accounts.filter(account => account.role === Roles.Admin).length,
      };
    });
    this.adminService.getAllRefills().subscribe(refills => {
      this.refillStats = {
        [RefillStatus.Pending]: refills.filter(refill => refill.status === RefillStatus.Pending).length,
        [RefillStatus.Complete]: refills.filter(refill => refill.status === RefillStatus.Complete).length,
        [RefillStatus.Cancelled]: refills.filter(refill => refill.status === RefillStatus.Cancelled).length,
        [RefillStatus.Failed]: refills.filter(refill => refill.status === RefillStatus.Failed).length,
      };
    });
    this.storeService.getInventory().subscribe(inventory => {
      this.inventoryStats = {
        total: inventory.length,
        inStock: inventory.filter(product => BigInt(product.stock) > 0n).length,
        outOfStock: inventory.filter(product => BigInt(product.stock) === 0n).length,
        // book value WIP
        // bookValue: inventory.reduce((acc, product) => acc + BigInt(product.cost), 0n),
        bookValue: 0,
        retailValue: Number(inventory.reduce((acc, product) => acc + BigInt(product.price) * BigInt(product.stock), 0n)) / 100,
      };
    });
    this.adminService.getAllTransactions().subscribe(transactions => {
      const totalCredit = transactions.filter(transaction => transaction.type === TransactionType.Credit).reduce((acc, transaction) => acc + BigInt(transaction.total), 0n);
      const revenue = transactions.filter(transaction => transaction.type === TransactionType.Debit).reduce((acc, transaction) => acc + BigInt(transaction.total), 0n);
      // const costOfGoodsSold = transactions.filter(transaction => transaction.type === TransactionType.CostOfGoodsSold).reduce((acc, transaction) => acc + BigInt(transaction.total), 0n);
      const costOfGoodsSold = 0n;
      this.financeStats = {
        totalCredit: Number(totalCredit) / 100,
        revenue: Number(revenue) / 100,
        creditBalance: Number(totalCredit - revenue) / 100,
        // cost of goods wip
        // costOfGoodsSold: transactions.filter(transaction => transaction.type === TransactionType.CostOfGoodsSold).reduce((acc, transaction) => acc + BigInt(transaction.total), 0n),
        costOfGoodsSold: Number(costOfGoodsSold) / 100,
        profit: Number(revenue - costOfGoodsSold) / 100,
      };

      const validStoreTransactions = transactions.filter(transaction => transaction.type === TransactionType.Debit && transaction.products.length > 0);

      const productMap: Record<string, number> = {};

      validStoreTransactions.forEach((transaction) => {
        transaction.products.forEach((product) => {
          const amount = parseFloat(product.amount); // Convert string to number
          if (!productMap[product.name]) {
            productMap[product.name] = 0;
          }
          productMap[product.name] += amount;
        });
      });

      const sortedProducts = Object.entries(productMap)
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount);
      const productRankings: Rank[] = sortedProducts.map((product, index) => ({
        place: index + 1,
        name: product.name,
        amount: product.amount,
      }));

      const accountMap: Record<string, number> = {};

      // Aggregate spending for each account
      validStoreTransactions.forEach((transaction) => {
        if (transaction.type === "debit") { // Adjust this condition based on your TransactionType
          const total = typeof transaction.total === "string" ? parseFloat(transaction.total) : Number(transaction.total);
          if (!accountMap[transaction.accountid]) {
            accountMap[transaction.accountid] = 0;
          }
          accountMap[transaction.accountid] += total;
        }
      });

      // Convert the account map into a sorted array
      const sortedAccounts = Object.entries(accountMap)
        .map(([accountid, totalSpent]) => ({ accountid, totalSpent }))
        .sort((a, b) => b.totalSpent - a.totalSpent);

      // Assign ranks
      const accountRankings: Rank[] = sortedAccounts.map((account, index) => ({
        place: index + 1,
        name: account.accountid,
        amount: account.totalSpent,
      }));

      this.storeStats = {
        mostPopular: productRankings.slice(0, 5),
        leastPopular: productRankings.slice(-5),
        biggestSpenders: accountRankings.slice(0, 5),
      };
      console.log(this.storeStats);

    });
  }
}
