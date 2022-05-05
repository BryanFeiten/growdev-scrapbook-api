"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostEntity = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
let PostEntity = class PostEntity extends typeorm_1.BaseEntity {
    constructor(userId, postHeader, postContent, postPrivacity) {
        super();
        this.userId = userId;
        this.postHeader = postHeader;
        this.postContent = postContent;
        this.postPrivacity = postPrivacity;
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", Number)
], PostEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", Number)
], PostEntity.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_header' }),
    __metadata("design:type", String)
], PostEntity.prototype, "postHeader", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_content' }),
    __metadata("design:type", String)
], PostEntity.prototype, "postContent", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'post_privacity' }),
    __metadata("design:type", String)
], PostEntity.prototype, "postPrivacity", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(type => User_1.UserEntity, user => user.posts),
    (0, typeorm_1.JoinColumn)({ name: 'user_id', referencedColumnName: 'id' }),
    __metadata("design:type", User_1.UserEntity)
], PostEntity.prototype, "user", void 0);
PostEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'post' }),
    __metadata("design:paramtypes", [Number, String, String, String])
], PostEntity);
exports.PostEntity = PostEntity;
