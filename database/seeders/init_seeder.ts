import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Account from '#models/account'
import User from '#models/user'
import ItemType from '#models/item_type'
import Room from '#models/room'
import Item from '#models/item'

export default class extends BaseSeeder {
  async run() {
    const account = await Account.create(
      { name: 'super admin'}
    )
    await User.createMany([
      {
        accountId: account.id,
        email: 'superadmin@fork-it.fr',
        password: 'azerty',
        firstName: 'superadmin',
        lastName: 'superadmin',
        profil: 'superadmin',
        loginId: 'superadmin'
      },
      {
        accountId: account.id,
        email: 'admin@fork-it.fr',
        password: 'azerty',
        firstName: 'admin',
        lastName: 'admin',
        profil: 'admin',
        loginId: 'admin'
      },
      {
        accountId: account.id,
        email: 'julien.marceau@fork-it.fr',
        password: 'azerty',
        firstName: 'Julien',
        lastName: 'Marceau',
        profil: 'manager',
        loginId: 'julien.marceau'
      },
      {
        accountId: account.id,
        email: 'leo.dupont@fork-it.fr',
        password: 'azerty',
        firstName: 'Leo',
        lastName: 'Dupont',
        profil: 'chef',
        loginId: 'leo.dupont'
      },
      {
        accountId: account.id,
        email: 'erika.nasbrowk@fork-it.fr',
        password: 'azerty',
        firstName: 'Erika',
        lastName: 'Nasbrowk',
        profil: 'chef',
        loginId: 'erika.nasbrowk'
      },
      {
        accountId: account.id,
        email: 'charlotte.dewitte@fork-it.fr',
        password: 'azerty',
        firstName: 'Charlotte',
        lastName: 'Dewitte',
        profil: 'server',
        loginId: 'charlotte.dewitte'
      },
      {
        accountId: account.id,
        email: 'antoine.dupont@fork-it.fr',
        password: 'azerty',
        firstName: 'Antoine',
        lastName: 'Dupont',
        profil: 'server',
        loginId: 'antoine.dupont'
      },
      {
        accountId: account.id,
        email: 'francois.brova@fork-it.fr',
        password: 'azerty',
        firstName: 'François',
        lastName: 'Brova',
        profil: 'server',
        loginId: 'francois.brova'
      },
    ]
    )

    const drink = await ItemType.create({
      name: 'Boissons',
      accountId: account.id
    })
    const starter = await ItemType.create({
      name: 'Entrées',
      accountId: account.id
    })
    const main = await ItemType.create({
      name: 'Plats',
      accountId: account.id
    })
    const dessert = await ItemType.create({
      name: 'Desserts',
      accountId: account.id
    })

    await Room.createMany([
      {
        name: 'Terrasse',
        number: 1,
        accountId: account.id
      },
      {
        name: 'Salle Principale',
        number: 2,
        accountId: account.id
      }
    ])
    await Item.createMany([
      {
        name: 'Vin rouge Bordeaux',
        description: 'Cocktail rafraîchissant à base de rhum, menthe fraîche et citron vert',
        price: 8,
        accountId: account.id,
        itemTypeId: drink.id
      },
      {
        name: 'Mojito',
        description: 'Cocktail rafraîchissant à base de rhum, menthe fraîche et citron vert',
        price: 9,
        accountId: account.id,
        itemTypeId: drink.id
      },
      {
        name: 'Smoothie Fruits Rouges',
        description: 'Mélange onctueux de fraises, framboises et mûres',
        price: 7,
        accountId: account.id,
        itemTypeId: drink.id
      },
      {
        name: 'Eau Pétillante San Pellegrino',
        description: 'Eau minérale gazeuse naturelle d\'Italie',
        price: 4,
        accountId: account.id,
        itemTypeId: drink.id
      },
      {
        name: 'Café Expresso',
        description: 'Café corsé provenant des meilleurs grains d\'Amérique du Sud',
        price: 2,
        accountId: account.id,
        itemTypeId: drink.id
      },
      {
        name: 'Salade de Chèvre Chaud',
        description: 'Salade verte, toasts de chèvre chaud, miel et noix',
        price: 11,
        accountId: account.id,
        itemTypeId: starter.id
      },
      {
        name: 'Soupe à l\'Oignon',
        description: 'Soupe traditionnelle française avec croûtons et fromage gratiné',
        price: 9,
        accountId: account.id,
        itemTypeId: starter.id
      },
      {
        name: 'Carpaccio de Bœuf',
        description: 'Fines tranches de bœuf, copeaux de parmesan, roquette et huile d\'olive',
        price: 13,
        accountId: account.id,
        itemTypeId: starter.id
      },
      {
        name: 'Tartare de Saumon',
        description: 'Saumon frais coupé au couteau, avocat et agrumes',
        price: 14,
        accountId: account.id,
        itemTypeId: starter.id
      },
      {
        name: 'Assiette de Charcuterie',
        description: 'Sélection de charcuteries fines avec cornichons et beurre',
        price: 12,
        accountId: account.id,
        itemTypeId: starter.id
      },
      {
        name: 'Entrecôte Grillée',
        description: 'Entrecôte de bœuf grillée, sauce au poivre, pommes sautées',
        price: 26,
        accountId: account.id,
        itemTypeId: main.id
      },
      {
        name: 'Filet de Bar',
        description: 'Filet de bar poêlé, risotto aux légumes de saison',
        price: 24,
        accountId: account.id,
        itemTypeId: main.id
      },
      {
        name: 'Poulet Fermier Rôti',
        description: 'Suprême de poulet fermier, purée maison et jus de volaille',
        price: 22,
        accountId: account.id,
        itemTypeId: main.id
      },
      {
        name: 'Ravioles aux Champignons',
        description: 'Ravioles fraîches farcies aux champignons, crème de parmesan',
        price: 19,
        accountId: account.id,
        itemTypeId: main.id
      },
      {
        name: 'Burger Gourmet',
        description: 'Steak haché façon bouchère, fromage raclette, bacon, sauce maison',
        price: 18,
        accountId: account.id,
        itemTypeId: main.id
      },
      {
        name: 'Crème Brûlée',
        description: 'Crème vanille et sa croûte caramélisée',
        price: 8,
        accountId: account.id,
        itemTypeId: dessert.id
      },
      {
        name: 'Tarte au Citron Meringuée',
        description: 'Pâte sablée, crème au citron et meringue italienne',
        price: 9,
        accountId: account.id,
        itemTypeId: dessert.id
      },
      {
        name: 'Moelleux au Chocolat',
        description: 'Gâteau au chocolat coulant, glace vanille',
        price: 10,
        accountId: account.id,
        itemTypeId: dessert.id
      },
      {
        name: 'Café Gourmand',
        description: 'Café expresso accompagné de mini desserts',
        price: 9,
        accountId: account.id,
        itemTypeId: dessert.id
      },
      {
        name: 'Assiette de Fromages',
        description: 'Sélection de fromages affinés et pain aux noix',
        price: 11,
        accountId: account.id,
        itemTypeId: dessert.id
      }  
    ])

  }
}