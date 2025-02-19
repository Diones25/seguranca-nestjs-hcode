import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { PrismaService } from "../prisma/prisma.service";

describe('UserService', () => {
  
  let userService: UserService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findAll: () => jest.fn(),
              findOne: () => jest.fn(),
              create: () => jest.fn(),
              update: () => jest.fn(),
              delete: () => jest.fn(),
              exists: () => jest.fn(),
            }
          }
        }
      ], 
    }).compile();

    userService = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);

  });

  it('Validar a definição', () => {
    expect(userService).toBeDefined();
  });


});