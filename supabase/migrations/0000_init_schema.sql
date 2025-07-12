create table "public"."orders" (
    "id" uuid not null default uuid_generate_v4(),
    "customer_name" text not null,
    "customer_phone" text not null,
    "wilaya" text not null,
    "commune" text not null,
    "full_address" text not null,
    "product_name" text not null,
    "size" text not null,
    "color" text not null,
    "total_price" numeric(10,2) not null,
    "status" text default 'pending'::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "ip_address" text,
    "product_id" uuid,
    "order_time" timestamp with time zone default now(),
    "quantity" numeric
);


create table "public"."product_types" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "image_url" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."product_types" enable row level security;

create table "public"."products" (
    "id" uuid not null default uuid_generate_v4(),
    "name" text not null,
    "description" text,
    "base_price" numeric(10,2) not null,
    "images" text[] default '{}'::text[],
    "product_type_id" uuid,
    "options" jsonb default '{"sizes": [], "colors": []}'::jsonb,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "price_before_discount" numeric
);


alter table "public"."products" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "email" text,
    "full_name" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."profiles" enable row level security;

create table "public"."reviews" (
    "id" uuid not null default uuid_generate_v4(),
    "product_id" uuid,
    "rating" integer not null,
    "comment" text,
    "reviewer_name" text,
    "created_at" timestamp with time zone default now()
);


alter table "public"."reviews" enable row level security;

create table "public"."shipping_data" (
    "id" uuid not null default gen_random_uuid(),
    "wilaya" text not null,
    "base_price" numeric not null default 0,
    "communes" text[] not null default '{}'::text[],
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now()
);


alter table "public"."shipping_data" enable row level security;

CREATE INDEX idx_orders_created_at ON public.orders USING btree (created_at);

CREATE INDEX idx_orders_ip_product ON public.orders USING btree (ip_address, product_id, order_time);

CREATE INDEX idx_orders_status ON public.orders USING btree (status);

CREATE INDEX idx_products_product_type_id ON public.products USING btree (product_type_id);

CREATE INDEX idx_reviews_product_id ON public.reviews USING btree (product_id);

CREATE UNIQUE INDEX orders_pkey ON public.orders USING btree (id);

CREATE UNIQUE INDEX product_types_name_key ON public.product_types USING btree (name);

CREATE UNIQUE INDEX product_types_pkey ON public.product_types USING btree (id);

CREATE UNIQUE INDEX products_pkey ON public.products USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX reviews_pkey ON public.reviews USING btree (id);

CREATE UNIQUE INDEX shipping_data_pkey ON public.shipping_data USING btree (id);

CREATE UNIQUE INDEX shipping_data_wilaya_key ON public.shipping_data USING btree (wilaya);

alter table "public"."orders" add constraint "orders_pkey" PRIMARY KEY using index "orders_pkey";

alter table "public"."product_types" add constraint "product_types_pkey" PRIMARY KEY using index "product_types_pkey";

alter table "public"."products" add constraint "products_pkey" PRIMARY KEY using index "products_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."reviews" add constraint "reviews_pkey" PRIMARY KEY using index "reviews_pkey";

alter table "public"."shipping_data" add constraint "shipping_data_pkey" PRIMARY KEY using index "shipping_data_pkey";

alter table "public"."orders" add constraint "orders_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) not valid;

alter table "public"."orders" validate constraint "orders_product_id_fkey";

alter table "public"."orders" add constraint "orders_status_check" CHECK ((status = ANY (ARRAY['pending'::text, 'confirmed'::text]))) not valid;

alter table "public"."orders" validate constraint "orders_status_check";

alter table "public"."product_types" add constraint "product_types_name_key" UNIQUE using index "product_types_name_key";

alter table "public"."products" add constraint "products_product_type_id_fkey" FOREIGN KEY (product_type_id) REFERENCES product_types(id) ON DELETE CASCADE not valid;

alter table "public"."products" validate constraint "products_product_type_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."reviews" add constraint "reviews_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE not valid;

alter table "public"."reviews" validate constraint "reviews_product_id_fkey";

alter table "public"."reviews" add constraint "reviews_rating_check" CHECK (((rating >= 1) AND (rating <= 5))) not valid;

alter table "public"."reviews" validate constraint "reviews_rating_check";

alter table "public"."shipping_data" add constraint "shipping_data_wilaya_key" UNIQUE using index "shipping_data_wilaya_key";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
    -- Function logic here
    RETURN NEW;
END;
$function$
;

grant delete on table "public"."orders" to "anon";

grant insert on table "public"."orders" to "anon";

grant references on table "public"."orders" to "anon";

grant select on table "public"."orders" to "anon";

grant trigger on table "public"."orders" to "anon";

grant truncate on table "public"."orders" to "anon";

grant update on table "public"."orders" to "anon";

grant delete on table "public"."orders" to "authenticated";

grant insert on table "public"."orders" to "authenticated";

grant references on table "public"."orders" to "authenticated";

grant select on table "public"."orders" to "authenticated";

grant trigger on table "public"."orders" to "authenticated";

grant truncate on table "public"."orders" to "authenticated";

grant update on table "public"."orders" to "authenticated";

grant delete on table "public"."orders" to "service_role";

grant insert on table "public"."orders" to "service_role";

grant references on table "public"."orders" to "service_role";

grant select on table "public"."orders" to "service_role";

grant trigger on table "public"."orders" to "service_role";

grant truncate on table "public"."orders" to "service_role";

grant update on table "public"."orders" to "service_role";

grant delete on table "public"."product_types" to "anon";

grant insert on table "public"."product_types" to "anon";

grant references on table "public"."product_types" to "anon";

grant select on table "public"."product_types" to "anon";

grant trigger on table "public"."product_types" to "anon";

grant truncate on table "public"."product_types" to "anon";

grant update on table "public"."product_types" to "anon";

grant delete on table "public"."product_types" to "authenticated";

grant insert on table "public"."product_types" to "authenticated";

grant references on table "public"."product_types" to "authenticated";

grant select on table "public"."product_types" to "authenticated";

grant trigger on table "public"."product_types" to "authenticated";

grant truncate on table "public"."product_types" to "authenticated";

grant update on table "public"."product_types" to "authenticated";

grant delete on table "public"."product_types" to "service_role";

grant insert on table "public"."product_types" to "service_role";

grant references on table "public"."product_types" to "service_role";

grant select on table "public"."product_types" to "service_role";

grant trigger on table "public"."product_types" to "service_role";

grant truncate on table "public"."product_types" to "service_role";

grant update on table "public"."product_types" to "service_role";

grant delete on table "public"."products" to "anon";

grant insert on table "public"."products" to "anon";

grant references on table "public"."products" to "anon";

grant select on table "public"."products" to "anon";

grant trigger on table "public"."products" to "anon";

grant truncate on table "public"."products" to "anon";

grant update on table "public"."products" to "anon";

grant delete on table "public"."products" to "authenticated";

grant insert on table "public"."products" to "authenticated";

grant references on table "public"."products" to "authenticated";

grant select on table "public"."products" to "authenticated";

grant trigger on table "public"."products" to "authenticated";

grant truncate on table "public"."products" to "authenticated";

grant update on table "public"."products" to "authenticated";

grant delete on table "public"."products" to "service_role";

grant insert on table "public"."products" to "service_role";

grant references on table "public"."products" to "service_role";

grant select on table "public"."products" to "service_role";

grant trigger on table "public"."products" to "service_role";

grant truncate on table "public"."products" to "service_role";

grant update on table "public"."products" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."reviews" to "anon";

grant insert on table "public"."reviews" to "anon";

grant references on table "public"."reviews" to "anon";

grant select on table "public"."reviews" to "anon";

grant trigger on table "public"."reviews" to "anon";

grant truncate on table "public"."reviews" to "anon";

grant update on table "public"."reviews" to "anon";

grant delete on table "public"."reviews" to "authenticated";

grant insert on table "public"."reviews" to "authenticated";

grant references on table "public"."reviews" to "authenticated";

grant select on table "public"."reviews" to "authenticated";

grant trigger on table "public"."reviews" to "authenticated";

grant truncate on table "public"."reviews" to "authenticated";

grant update on table "public"."reviews" to "authenticated";

grant delete on table "public"."reviews" to "service_role";

grant insert on table "public"."reviews" to "service_role";

grant references on table "public"."reviews" to "service_role";

grant select on table "public"."reviews" to "service_role";

grant trigger on table "public"."reviews" to "service_role";

grant truncate on table "public"."reviews" to "service_role";

grant update on table "public"."reviews" to "service_role";

grant delete on table "public"."shipping_data" to "anon";

grant insert on table "public"."shipping_data" to "anon";

grant references on table "public"."shipping_data" to "anon";

grant select on table "public"."shipping_data" to "anon";

grant trigger on table "public"."shipping_data" to "anon";

grant truncate on table "public"."shipping_data" to "anon";

grant update on table "public"."shipping_data" to "anon";

grant delete on table "public"."shipping_data" to "authenticated";

grant insert on table "public"."shipping_data" to "authenticated";

grant references on table "public"."shipping_data" to "authenticated";

grant select on table "public"."shipping_data" to "authenticated";

grant trigger on table "public"."shipping_data" to "authenticated";

grant truncate on table "public"."shipping_data" to "authenticated";

grant update on table "public"."shipping_data" to "authenticated";

grant delete on table "public"."shipping_data" to "service_role";

grant insert on table "public"."shipping_data" to "service_role";

grant references on table "public"."shipping_data" to "service_role";

grant select on table "public"."shipping_data" to "service_role";

grant trigger on table "public"."shipping_data" to "service_role";

grant truncate on table "public"."shipping_data" to "service_role";

grant update on table "public"."shipping_data" to "service_role";

create policy "Allow anonymous order creation"
on "public"."orders"
as permissive
for insert
to public
with check (true);


create policy "Authenticated users can delete orders"
on "public"."orders"
as permissive
for delete
to authenticated
using (true);


create policy "Authenticated users can update orders"
on "public"."orders"
as permissive
for update
to authenticated
using (true);


create policy "Authenticated users can view all orders"
on "public"."orders"
as permissive
for select
to authenticated
using (true);


create policy "Authenticated users can delete product types"
on "public"."product_types"
as permissive
for delete
to authenticated
using (true);


create policy "Authenticated users can insert product types"
on "public"."product_types"
as permissive
for insert
to authenticated
with check (true);


create policy "Authenticated users can update product types"
on "public"."product_types"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "all users can view all product types"
on "public"."product_types"
as permissive
for select
to public
using (true);


create policy "Authenticated users can delete products"
on "public"."products"
as permissive
for delete
to authenticated
using (true);


create policy "Authenticated users can insert products"
on "public"."products"
as permissive
for insert
to authenticated
with check (true);


create policy "Authenticated users can update products"
on "public"."products"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "all users can read products"
on "public"."products"
as permissive
for select
to public
using (true);


create policy "Users can insert their own profile"
on "public"."profiles"
as permissive
for insert
to public
with check ((id = ( SELECT auth.uid() AS uid)));


create policy "Users can update their own profile"
on "public"."profiles"
as permissive
for update
to public
using ((( SELECT auth.uid() AS uid) = id))
with check ((( SELECT auth.uid() AS uid) = id));


create policy "Users can view their own profile"
on "public"."profiles"
as permissive
for select
to public
using ((id = ( SELECT auth.uid() AS uid)));


create policy "Anyone can create reviews"
on "public"."reviews"
as permissive
for insert
to public
with check (true);


create policy "Enable read access for all users"
on "public"."reviews"
as permissive
for select
to public
using (true);


create policy "Authenticated users can delete shipping data"
on "public"."shipping_data"
as permissive
for delete
to authenticated
using (true);


create policy "Authenticated users can insert shipping data"
on "public"."shipping_data"
as permissive
for insert
to authenticated
with check (true);


create policy "Authenticated users can update shipping data"
on "public"."shipping_data"
as permissive
for update
to authenticated
using (true)
with check (true);


create policy "all users can view shipping data"
on "public"."shipping_data"
as permissive
for select
to public
using (true);




