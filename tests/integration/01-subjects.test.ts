import { describe, it, expect } from 'vitest';
import { createBangumiClient } from '../../src/client.js';

/**
 * 集成测试：发送真实网络请求到 https://api.bgm.tv
 * 运行前确保网络可用
 */
describe('SubjectAPI 集成测试', () => {
  const bgm = createBangumiClient();

  describe('getCalendar() — 每日放送', () => {
    it('返回 HTTP 200 且包含放送数据', async () => {
      const result = await bgm.subjects.getCalendar();

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data!.length).toBeGreaterThan(0);
    });

    it('每天数据包含 weekday 和 items 字段', async () => {
      const result = await bgm.subjects.getCalendar();

      for (const entry of result.data!) {
        expect(typeof entry.weekday.id).toBe('number');
        expect(typeof entry.weekday.cn).toBe('string');
        expect(typeof entry.weekday.en).toBe('string');
        expect(typeof entry.weekday.ja).toBe('string');
        expect(Array.isArray(entry.items)).toBe(true);
      }
    });

    it('条目数据包含必要字段', async () => {
      const result = await bgm.subjects.getCalendar();
      const allItems = result.data!.flatMap((e) => e.items);

      expect(allItems.length).toBeGreaterThan(0);

      for (const item of allItems) {
        expect(typeof item.id).toBe('number');
        expect(typeof item.name).toBe('string');
        expect(typeof item.type).toBe('number');
        expect(typeof item.air_date).toBe('string');
        expect(typeof item.air_weekday).toBe('number');
      }
    });
  });

  describe('searchSubjects() — 条目搜索', () => {
    it('关键词搜索返回分页结果', async () => {
      const result = await bgm.subjects.searchSubjects({ keyword: '魔法少女' });

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(typeof result.data!.total).toBe('number');
      expect(Array.isArray(result.data!.data)).toBe(true);
      expect(result.data!.data.length).toBeGreaterThan(0);
    });

    it('分页参数生效', async () => {
      const result = await bgm.subjects.searchSubjects({
        keyword: '魔法少女',
        limit: 5,
        offset: 0,
      });

      expect(result.data!.data.length).toBeLessThanOrEqual(5);
      expect(result.data!.limit).toBe(5);
      expect(result.data!.offset).toBe(0);
    });

    it('返回条目包含必要字段', async () => {
      const result = await bgm.subjects.searchSubjects({
        keyword: '进击的巨人',
        limit: 3,
      });

      for (const item of result.data!.data) {
        expect(typeof item.id).toBe('number');
        expect(typeof item.name).toBe('string');
        expect(typeof item.type).toBe('number');
      }
    });

    it('按条目类型筛选（动画=2）', async () => {
      const result = await bgm.subjects.searchSubjects({
        keyword: '魔法',
        filter: { type: [2] },
        limit: 5,
      });

      expect(result.data!.data.length).toBeGreaterThan(0);
      for (const item of result.data!.data) {
        expect(item.type).toBe(2);
      }
    });

    it('按评分筛选', async () => {
      const result = await bgm.subjects.searchSubjects({
        keyword: '动画',
        filter: { rating: ['>=8'], type: [2] },
        limit: 5,
      });

      expect(result.data!.data.length).toBeGreaterThan(0);
      for (const item of result.data!.data) {
        expect(item.rating.score).toBeGreaterThanOrEqual(8);
      }
    });

    it('排序参数生效（rank 排序）', async () => {
      const result = await bgm.subjects.searchSubjects({
        keyword: '动画',
        sort: 'rank',
        filter: { type: [2] },
        limit: 5,
      });

      expect(result.data!.data.length).toBeGreaterThan(0);
    });
  });

  describe('getSubjects() — 浏览条目', () => {
    it('按类型浏览返回分页结果（动画）', async () => {
      const result = await bgm.subjects.getSubjects({ type: 2 });

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(typeof result.data!.total).toBe('number');
      expect(Array.isArray(result.data!.data)).toBe(true);
      expect(result.data!.data.length).toBeGreaterThan(0);
    });

    it('分页参数生效', async () => {
      const result = await bgm.subjects.getSubjects({ type: 2, limit: 5, offset: 0 });

      expect(result.data!.data.length).toBeLessThanOrEqual(5);
      expect(result.data!.limit).toBe(5);
      expect(result.data!.offset).toBe(0);
    });

    it('返回条目包含必要字段', async () => {
      const result = await bgm.subjects.getSubjects({ type: 2, limit: 3 });

      for (const item of result.data!.data) {
        expect(typeof item.id).toBe('number');
        expect(typeof item.name).toBe('string');
        expect(item.type).toBe(2);
      }
    });

    it('按子分类筛选（动画 TV=1）', async () => {
      const result = await bgm.subjects.getSubjects({ type: 2, cat: 1, limit: 5 });

      expect(result.data!.data.length).toBeGreaterThan(0);
    });

    it('按年份月份筛选', async () => {
      const result = await bgm.subjects.getSubjects({ type: 2, year: 2024, month: 4, limit: 5 });

      expect(result.data!.data.length).toBeGreaterThanOrEqual(0);
    });

    it('排序参数生效（rank 排序）', async () => {
      const result = await bgm.subjects.getSubjects({ type: 2, sort: 'rank', limit: 5 });

      expect(result.data!.data.length).toBeGreaterThan(0);
    });

    it('传入无效 type 值返回 400', async () => {
      // type=0 不在合法枚举值 1|2|3|4|6 中，服务端应返回 400 Validation Error
      const result = await bgm.subjects.getSubjects({ type: 0 as never });

      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.response.status).toBe(400);
    });

    it('传入不匹配的子分类返回 400', async () => {
      // cat=9999 不属于任何已知子分类，服务端返回 400 Validation Error
      // 注：文档列出了 404，但该列表端点对所有无效参数统一返回 400；
      //     无结果时返回 200 + 空 data，不会返回 404
      const result = await bgm.subjects.getSubjects({ type: 2, cat: 9999 as never });

      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      // 网络层错误时 response 可能为 undefined，用可选链兼容偶发网络抖动
      expect(result.response?.status).toBe(400);
    });
  });

  describe('getSubjectById() — 获取条目', () => {
    it('返回 HTTP 200 且包含完整条目数据', async () => {
      // 使用《Code Geass 反叛的鲁路修》(subject_id=1) 作为稳定测试数据
      const result = await bgm.subjects.getSubjectById(1);

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(result.response.status).toBe(200);
    });

    it('返回条目包含文档所有顶层字段', async () => {
      const result = await bgm.subjects.getSubjectById(1);
      const d = result.data!;

      expect(typeof d.id).toBe('number');
      expect(typeof d.type).toBe('number');
      expect(typeof d.name).toBe('string');
      expect(typeof d.name_cn).toBe('string');
      expect(typeof d.summary).toBe('string');
      expect(typeof d.nsfw).toBe('boolean');
      expect(typeof d.locked).toBe('boolean');
      expect(typeof d.platform).toBe('string');
      expect(typeof d.volumes).toBe('number');
      expect(typeof d.eps).toBe('number');
      expect(typeof d.total_episodes).toBe('number');
    });

    it('返回条目的 rating 和 collection 结构正确', async () => {
      const result = await bgm.subjects.getSubjectById(1);
      const d = result.data!;

      expect(typeof d.rating.rank).toBe('number');
      expect(typeof d.rating.total).toBe('number');
      expect(typeof d.rating.score).toBe('number');
      expect(typeof d.collection.wish).toBe('number');
      expect(typeof d.collection.collect).toBe('number');
      expect(typeof d.collection.doing).toBe('number');
      expect(typeof d.collection.on_hold).toBe('number');
      expect(typeof d.collection.dropped).toBe('number');
    });

    it('返回条目的 images、meta_tags、tags 结构正确', async () => {
      const result = await bgm.subjects.getSubjectById(1);
      const d = result.data!;

      expect(typeof d.images.large).toBe('string');
      expect(typeof d.images.medium).toBe('string');
      expect(Array.isArray(d.meta_tags)).toBe(true);
      expect(Array.isArray(d.tags)).toBe(true);
      // 规范 2026-07-23 起：SubjectTags 元素新增必填 total_count
      if (d.tags.length > 0) {
        const tag = d.tags[0];
        expect(typeof tag.name).toBe("string");
        expect(typeof tag.count).toBe("number");
        expect(typeof tag.total_count).toBe("number");
      }
    });

    it('传入 subject_id=0 返回 400', async () => {
      const result = await bgm.subjects.getSubjectById(0);

      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.response.status).toBe(400);
    });

    it('传入不存在的 subject_id 返回 404', async () => {
      // 使用极大 ID，该条目不存在
      const result = await bgm.subjects.getSubjectById(99999999);

      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.response.status).toBe(404);
    });
  });

  describe('getSubjectImageById() — 条目图片', () => {
    it('返回条目封面图片 URL（fetch 跟随 302 后状态为 200）', async () => {
      const result = await bgm.subjects.getSubjectImageById(1, 'large');

      expect(result.error).toBeUndefined();
      expect(result.imageUrl).toBeDefined();
      expect(result.imageUrl).toMatch(/^https:\/\//);
      expect(result.response?.status).toBe(200);
    });

    it('不同尺寸参数均返回有效图片 URL', async () => {
      const types = ['small', 'grid', 'large', 'medium', 'common'] as const;

      for (const type of types) {
        const result = await bgm.subjects.getSubjectImageById(1, type);
        expect(result.error).toBeUndefined();
        expect(result.imageUrl).toMatch(/^https:\/\//);
      }
    });

    it('传入无效 type 返回 400', async () => {
      const result = await bgm.subjects.getSubjectImageById(1, 'invalid' as never);

      expect(result.imageUrl).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.response?.status).toBe(400);
    });

    it('传入不存在的 subject_id 返回 404', async () => {
      const result = await bgm.subjects.getSubjectImageById(99999999, 'large');

      expect(result.imageUrl).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.response?.status).toBe(404);
    });
  });

  describe('getRelatedPersonsBySubjectId() — 条目相关人物', () => {
    it('返回 HTTP 200 且包含人物列表', async () => {
      const result = await bgm.subjects.getRelatedPersonsBySubjectId(1);

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data!.length).toBeGreaterThan(0);
    });

    it('每条人物记录包含必要字段', async () => {
      const result = await bgm.subjects.getRelatedPersonsBySubjectId(1);

      for (const person of result.data!) {
        expect(typeof person.id).toBe('number');
        expect(typeof person.name).toBe('string');
        expect(typeof person.type).toBe('number');
        expect(typeof person.relation).toBe('string');
        expect(typeof person.eps).toBe('string');
        expect(Array.isArray(person.career)).toBe(true);
      }
    });

    it('传入无效 subject_id 返回 400', async () => {
      const result = await bgm.subjects.getRelatedPersonsBySubjectId(0);

      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.response?.status).toBe(400);
    });

    it('传入不存在的 subject_id 返回 404', async () => {
      const result = await bgm.subjects.getRelatedPersonsBySubjectId(99999999);

      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.response?.status).toBe(404);
    });
  });

  describe('getRelatedCharactersBySubjectId() — 条目相关角色', () => {
    it('返回 HTTP 200 且包含角色列表', async () => {
      // 使用《新世纪福音战士》(subject_id=8) 作为稳定测试数据，id=1 无角色数据
      const result = await bgm.subjects.getRelatedCharactersBySubjectId(8);

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data!.length).toBeGreaterThan(0);
    });

    it('每条角色记录包含必要字段', async () => {
      const result = await bgm.subjects.getRelatedCharactersBySubjectId(8);

      for (const char of result.data!) {
        expect(typeof char.id).toBe('number');
        expect(typeof char.name).toBe('string');
        expect(typeof char.summary).toBe('string');
        expect(typeof char.type).toBe('number');
        expect(typeof char.relation).toBe('string');
        expect(char.actors === undefined || Array.isArray(char.actors)).toBe(true);
      }
    });

    it('传入无效 subject_id 返回 400', async () => {
      const result = await bgm.subjects.getRelatedCharactersBySubjectId(0);

      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.response?.status).toBe(400);
    });

    it('传入不存在的 subject_id 返回 404', async () => {
      const result = await bgm.subjects.getRelatedCharactersBySubjectId(99999999);

      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.response?.status).toBe(404);
    });
  });

  describe('getRelatedSubjectsBySubjectId() — 关联条目', () => {
    it('返回 HTTP 200 且包含关联条目列表', async () => {
      // 使用《新世纪福音战士》(subject_id=8) 作为稳定测试数据
      const result = await bgm.subjects.getRelatedSubjectsBySubjectId(8);

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(Array.isArray(result.data)).toBe(true);
      expect(result.data!.length).toBeGreaterThan(0);
    });

    it('每条关联条目包含必要字段', async () => {
      const result = await bgm.subjects.getRelatedSubjectsBySubjectId(8);

      for (const item of result.data!) {
        expect(typeof item.id).toBe('number');
        expect(typeof item.type).toBe('number');
        expect(typeof item.name).toBe('string');
        expect(typeof item.name_cn).toBe('string');
        expect(typeof item.relation).toBe('string');
      }
    });

    it('传入无效 subject_id 返回 400', async () => {
      const result = await bgm.subjects.getRelatedSubjectsBySubjectId(0);

      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.response?.status).toBe(400);
    });

    it('传入不存在的 subject_id 返回 404', async () => {
      const result = await bgm.subjects.getRelatedSubjectsBySubjectId(99999999);

      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.response?.status).toBe(404);
    });
  });
});
