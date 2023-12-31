from datetime import datetime
from app.models import db, Transaction, User,  TransactionItem, Product, environment, SCHEMA
from sqlalchemy.sql import text

def seed_transaction_items():
    camel_up_id = Product.query.filter_by(name='Camel Up').first().id
    digimon_deck_id = Product.query.filter_by(name='Digimon Card Game Starter Decks').first().id
    pokemon_puzzle_id = Product.query.filter_by(name='Pokemon Jigsaw Puzzle').first().id
    jenga_id = Product.query.filter_by(name='JENGA').first().id

    demo_transaction_id = Transaction.query.filter_by(user_id=User.query.filter_by(username='Demo').first().id).first().id
    marnie_transaction_id = Transaction.query.filter_by(user_id=User.query.filter_by(username='marnie').first().id).first().id
    bobbie_transaction_id = Transaction.query.filter_by(user_id=User.query.filter_by(username='bobbie').first().id).first().id

    demo_item = TransactionItem(
        transaction_id=demo_transaction_id,
        product_id=camel_up_id,
        quantity=1,
        price_at_time_of_purchase=31.99
    )
    demo_item_2 = TransactionItem(
        transaction_id=demo_transaction_id,
        product_id=digimon_deck_id,
        quantity=1,
        price_at_time_of_purchase=47.97
    )
    demo_item_3 = TransactionItem(
        transaction_id=demo_transaction_id,
        product_id=pokemon_puzzle_id,
        quantity=1,
        price_at_time_of_purchase=19.18
    )

    marnie_item = TransactionItem(
        transaction_id=marnie_transaction_id,
        product_id=digimon_deck_id,
        quantity=1,
        price_at_time_of_purchase=47.97
    )
    bobbie_item_1 = TransactionItem(
        transaction_id=bobbie_transaction_id,
        product_id=digimon_deck_id,
        quantity=1,
        price_at_time_of_purchase=31.99
    )
    bobbie_item_2 = TransactionItem(
        transaction_id=bobbie_transaction_id,
        product_id=pokemon_puzzle_id,
        quantity=1,
        price_at_time_of_purchase=19.18
    )

    db.session.add_all([demo_item, demo_item_2, demo_item_3, marnie_item, bobbie_item_1, bobbie_item_2])
    db.session.commit()

def undo_transaction_items():
    if environment == "production":
        db.session.execute(f"TRUNCATE table {SCHEMA}.transaction_items RESTART IDENTITY CASCADE;")
    else:
        db.session.execute(text("DELETE FROM transaction_items"))
    db.session.commit()
