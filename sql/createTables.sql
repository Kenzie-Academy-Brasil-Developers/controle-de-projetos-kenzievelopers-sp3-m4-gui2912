CREATE type "OS" AS ENUM ('Windows', 'Linux', 'MacOS');

create table if not exists developers (
	"id" serial primary key,
	"name" varchar(50) not null,
	"email" varchar(50) unique not null
);

create table if not exists developer_infos (
	"id" serial primary key,
	"developerSince" date not null,
	"preferredOS" "OS" not null,
	"developerId" integer unique not null,
	foreign key("developerId") references developers("id") on delete cascade
);

create table if not exists projects (
	"id" serial primary key,
	"name" varchar(50) not null,
	"description" text,
	"estimatedTime" varchar(20) not null,
	"repository" varchar(120) not null,
	"startDate" date not null,
	"endDate" date,
	"developerId" integer not null,
	foreign key("developerId") references developers("id") on delete set null
);

create table if not exists technologies(
	"id" serial primary key,
	"name" varchar(30) not null
);

create table if not exists projects_technologies(
	"id" serial primary key,
	"addedIn" date not null,
	"technologyId" integer not null,
	"projectId" integer not null,
	foreign key("technologyId") references technologies("id") on delete cascade,
	foreign key("projectId") references projects("id") on delete cascade
);	

insert into technologies("name") values ('JavaScript'), ('Python'), ('React'), ('Express.js'), ('HTML'), ('CSS'), ('Django'), ('PostgreSQL'), ('MongoDB')
;

