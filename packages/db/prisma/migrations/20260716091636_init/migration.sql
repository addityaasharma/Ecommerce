-- CreateEnum
CREATE TYPE "vendor_wallet_txn_type" AS ENUM ('credit', 'debit');

-- CreateEnum
CREATE TYPE "vendor_wallet_txn_source" AS ENUM ('order_earning', 'payout_withdrawal', 'refund_reversal', 'adjustment');

-- CreateEnum
CREATE TYPE "vendor_payout_status" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('pending', 'in-transit', 'confirmed', 'cancelled');

-- CreateEnum
CREATE TYPE "affiliate_status" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "profile_picture" VARCHAR(255),
    "phone_number" VARCHAR(20),
    "bio" TEXT,
    "role" VARCHAR(50) NOT NULL DEFAULT 'admin',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor" (
    "id" SERIAL NOT NULL,
    "admin_id" INTEGER NOT NULL,
    "store_name" VARCHAR(255) NOT NULL,
    "store_description" TEXT,
    "gst_number" VARCHAR(255),
    "upi_id" VARCHAR(255),
    "bank_account_number" VARCHAR(255),
    "bank_ifsc" VARCHAR(20),
    "bank_account_holder" VARCHAR(255),
    "commission_rate" DOUBLE PRECISION NOT NULL DEFAULT 10.0,
    "approval_status" VARCHAR(20) NOT NULL DEFAULT 'pending',
    "is_active" BOOLEAN DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_wallet" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "total_earned" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "total_withdrawn" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_wallet_transaction" (
    "id" SERIAL NOT NULL,
    "wallet_id" INTEGER NOT NULL,
    "type" "vendor_wallet_txn_type" NOT NULL,
    "source" "vendor_wallet_txn_source" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "balance_after" DOUBLE PRECISION NOT NULL,
    "reference_id" INTEGER,
    "note" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_wallet_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vendor_payout" (
    "id" SERIAL NOT NULL,
    "vendor_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" "vendor_payout_status" NOT NULL DEFAULT 'pending',
    "payment_screenshot" VARCHAR(255),
    "note" VARCHAR(255),
    "wallet_transaction_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vendor_payout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "logo" VARCHAR(255),
    "address" VARCHAR(255),
    "gst_number" VARCHAR(255),
    "support_email" VARCHAR(255),
    "support_phone" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" SERIAL NOT NULL,
    "order_placed" BOOLEAN DEFAULT false,
    "payment_failed" BOOLEAN DEFAULT false,
    "low_stock" BOOLEAN DEFAULT false,
    "new_user_registration" BOOLEAN DEFAULT false,
    "new_product_review" BOOLEAN DEFAULT false,
    "email_notifications" BOOLEAN DEFAULT false,
    "sms_notifications" BOOLEAN DEFAULT false,
    "push_notifications" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_settings" (
    "id" SERIAL NOT NULL,
    "payment_gateway" VARCHAR(255) NOT NULL,
    "api_key" VARCHAR(255) NOT NULL,
    "api_secret" VARCHAR(255) NOT NULL,
    "upi_id" VARCHAR(255),
    "cod" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "slug" VARCHAR(255) NOT NULL,
    "icon" VARCHAR(255),
    "color" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "category_id" INTEGER,
    "vendor_id" INTEGER,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "product_image" VARCHAR(255) NOT NULL,
    "product_images" JSONB,
    "sizes" JSONB,
    "colors" JSONB,
    "price" DOUBLE PRECISION NOT NULL,
    "compare_at_price" DOUBLE PRECISION,
    "stock" INTEGER NOT NULL,
    "unit_price" DOUBLE PRECISION,
    "charge_tax" BOOLEAN DEFAULT false,
    "tax_rate" DOUBLE PRECISION,
    "cost_price" DOUBLE PRECISION,
    "sku" VARCHAR(255) NOT NULL,
    "barcode" VARCHAR(255),
    "country_of_origin" VARCHAR(255),
    "weight" DOUBLE PRECISION,
    "weight_unit" VARCHAR(20),
    "commission" INTEGER DEFAULT 2,
    "product_type" VARCHAR(255),
    "sell_when_out_of_stock" BOOLEAN DEFAULT false,
    "quantity" INTEGER NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_review" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banner" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "link_name" VARCHAR(255),
    "link" VARCHAR(255),
    "code" VARCHAR(255),
    "status" VARCHAR(50) NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "banner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255),
    "image" VARCHAR(255),

    CONSTRAINT "collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_products" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "collection_id" INTEGER NOT NULL,

    CONSTRAINT "collection_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255),
    "google_id" VARCHAR(128),
    "profile_picture" VARCHAR(255),
    "phone_number" VARCHAR(20),
    "bio" TEXT,
    "role" VARCHAR(50) NOT NULL DEFAULT 'customer',
    "is_affiliate" BOOLEAN DEFAULT false,
    "affiliate_id" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affiliate_dashboard" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "total_orders" DOUBLE PRECISION DEFAULT 0.0,
    "total_revenue" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "total_withdrawal" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "upi_id" VARCHAR(255) NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "affiliate_dashboard_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordered_list" (
    "id" SERIAL NOT NULL,
    "affiliate_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "order_id" INTEGER,
    "commission" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "status" "order_status" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ordered_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdrawal" (
    "id" SERIAL NOT NULL,
    "affiliate_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "payslip" VARCHAR(255),
    "status" "affiliate_status" NOT NULL DEFAULT 'pending',
    "note" VARCHAR(255),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "withdrawal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" SERIAL NOT NULL,
    "affiliate_id" INTEGER NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "address" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "street" VARCHAR(255) NOT NULL,
    "city" VARCHAR(255) NOT NULL,
    "state" VARCHAR(255) NOT NULL,
    "postal_code" VARCHAR(20) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wishlist" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "order_id" VARCHAR(255) NOT NULL,
    "address_id" INTEGER,
    "shipping_address" JSONB NOT NULL,
    "subtotal" DOUBLE PRECISION NOT NULL,
    "tax_amount" DOUBLE PRECISION DEFAULT 0,
    "razorpay_order_id" VARCHAR(255),
    "discount" DOUBLE PRECISION DEFAULT 0,
    "shipping_charges" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "total_price" DOUBLE PRECISION NOT NULL,
    "order_source" VARCHAR(50) NOT NULL DEFAULT 'cart',
    "affiliate_id" VARCHAR(100),
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "payment_method" VARCHAR(50) NOT NULL,
    "payment_status" VARCHAR(50) NOT NULL DEFAULT 'unpaid',
    "shiprocket_order_id" VARCHAR(100),
    "shipment_id" VARCHAR(100),
    "tracking_url" VARCHAR(500),
    "awb_code" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordered_items" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "product_id" INTEGER,
    "product_name" VARCHAR(255) NOT NULL,
    "product_sku" VARCHAR(255) NOT NULL,
    "product_image" VARCHAR(255),
    "quantity" INTEGER NOT NULL,
    "unit_price" DOUBLE PRECISION NOT NULL,
    "tax_rate" DOUBLE PRECISION,
    "tax_amount" DOUBLE PRECISION,
    "discount" DOUBLE PRECISION DEFAULT 0,
    "total_price" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ordered_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "payment_method" VARCHAR(50) NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" VARCHAR(10) NOT NULL DEFAULT 'INR',
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "razorpay_order_id" VARCHAR(255),
    "razorpay_payment_id" VARCHAR(255),
    "razorpay_signature" VARCHAR(255),
    "payment_response" JSONB,
    "refund_id" VARCHAR(255),
    "refund_amount" DOUBLE PRECISION,
    "refund_status" VARCHAR(50),
    "refund_reason" VARCHAR(255),
    "failure_reason" VARCHAR(255),
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refund" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "payment_id" INTEGER NOT NULL,
    "reason" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "refund_amount" DOUBLE PRECISION NOT NULL,
    "refund_type" VARCHAR(20) NOT NULL,
    "item_ids" JSONB,
    "status" VARCHAR(50) NOT NULL DEFAULT 'pending',
    "razorpay_refund_id" VARCHAR(255),
    "bank_reference" VARCHAR(255),
    "rejection_reason" TEXT,
    "processed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pickup_agent_id" INTEGER,
    "picked_up_at" TIMESTAMP(3),
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "phone_number" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "agent_id" VARCHAR(255) NOT NULL,

    CONSTRAINT "agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_conversation" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'open',
    "last_message" VARCHAR(255),
    "last_message_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "unread_by_admin" INTEGER NOT NULL DEFAULT 0,
    "unread_by_user" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "support_message" (
    "id" SERIAL NOT NULL,
    "conversation_id" INTEGER NOT NULL,
    "sender_type" VARCHAR(10) NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "message" TEXT,
    "attachment_url" VARCHAR(500),
    "attachment_type" VARCHAR(20),
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "support_message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_username_key" ON "admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_admin_id_key" ON "vendor"("admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_wallet_vendor_id_key" ON "vendor_wallet"("vendor_id");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_payout_wallet_transaction_id_key" ON "vendor_payout"("wallet_transaction_id");

-- CreateIndex
CREATE UNIQUE INDEX "store_name_key" ON "store"("name");

-- CreateIndex
CREATE UNIQUE INDEX "store_gst_number_key" ON "store"("gst_number");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_key" ON "category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "category_slug_key" ON "category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "products_name_key" ON "products"("name");

-- CreateIndex
CREATE UNIQUE INDEX "products_sku_key" ON "products"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "products_barcode_key" ON "products"("barcode");

-- CreateIndex
CREATE UNIQUE INDEX "collection_name_key" ON "collection"("name");

-- CreateIndex
CREATE UNIQUE INDEX "collection_products_product_id_collection_id_key" ON "collection_products"("product_id", "collection_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_google_id_key" ON "user"("google_id");

-- CreateIndex
CREATE UNIQUE INDEX "affiliate_dashboard_user_id_key" ON "affiliate_dashboard"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "orders_order_id_key" ON "orders"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "support_conversation_user_id_key" ON "support_conversation"("user_id");

-- AddForeignKey
ALTER TABLE "vendor" ADD CONSTRAINT "vendor_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_wallet" ADD CONSTRAINT "vendor_wallet_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_wallet_transaction" ADD CONSTRAINT "vendor_wallet_transaction_wallet_id_fkey" FOREIGN KEY ("wallet_id") REFERENCES "vendor_wallet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_payout" ADD CONSTRAINT "vendor_payout_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vendor_payout" ADD CONSTRAINT "vendor_payout_wallet_transaction_id_fkey" FOREIGN KEY ("wallet_transaction_id") REFERENCES "vendor_wallet_transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_review" ADD CONSTRAINT "product_review_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_review" ADD CONSTRAINT "product_review_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_products" ADD CONSTRAINT "collection_products_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_products" ADD CONSTRAINT "collection_products_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affiliate_dashboard" ADD CONSTRAINT "affiliate_dashboard_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordered_list" ADD CONSTRAINT "ordered_list_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "affiliate_dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordered_list" ADD CONSTRAINT "ordered_list_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordered_list" ADD CONSTRAINT "ordered_list_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdrawal" ADD CONSTRAINT "withdrawal_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "affiliate_dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_affiliate_id_fkey" FOREIGN KEY ("affiliate_id") REFERENCES "affiliate_dashboard"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "address" ADD CONSTRAINT "address_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wishlist" ADD CONSTRAINT "wishlist_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordered_items" ADD CONSTRAINT "ordered_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ordered_items" ADD CONSTRAINT "ordered_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refund" ADD CONSTRAINT "refund_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refund" ADD CONSTRAINT "refund_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refund" ADD CONSTRAINT "refund_payment_id_fkey" FOREIGN KEY ("payment_id") REFERENCES "payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refund" ADD CONSTRAINT "refund_pickup_agent_id_fkey" FOREIGN KEY ("pickup_agent_id") REFERENCES "agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_conversation" ADD CONSTRAINT "support_conversation_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "support_message" ADD CONSTRAINT "support_message_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "support_conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
