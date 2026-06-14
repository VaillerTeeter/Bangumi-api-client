import { describe, it, expect } from 'vitest';
import { createBangumiClient } from '../../src/client.js';

/**
 * 集成测试：发送真实网络请求到 https://api.bgm.tv
 * 运行前确保网络可用
 */
describe('EpisodeAPI 集成测试', () => {
  const bgm = createBangumiClient();

  describe('getEpisodes() — 章节列表', () => {
    it('返回 HTTP 200 且包含分页数据结构', async () => {
      const result = await bgm.episodes.getEpisodes(8);

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
      expect(typeof result.data!.total).toBe('number');
      expect(typeof result.data!.limit).toBe('number');
      expect(typeof result.data!.offset).toBe('number');
      expect(Array.isArray(result.data!.data)).toBe(true);
    });

    it('每条章节包含必要字段', async () => {
      const result = await bgm.episodes.getEpisodes(8, { limit: 3 });

      expect(result.error).toBeUndefined();
      const episodes = result.data!.data;
      expect(episodes.length).toBeGreaterThan(0);
      for (const ep of episodes) {
        expect(typeof ep.id).toBe('number');
        expect(typeof ep.type).toBe('number');
        expect(typeof ep.name).toBe('string');
        expect(typeof ep.sort).toBe('number');
        expect(typeof ep.airdate).toBe('string');
        expect(typeof ep.comment).toBe('number');
        expect(typeof ep.duration).toBe('string');
        expect(typeof ep.desc).toBe('string');
        expect(typeof ep.disc).toBe('number');
      }
    });

    it('分页参数生效（limit=3 只返回 3 条）', async () => {
      const result = await bgm.episodes.getEpisodes(8, { limit: 3, offset: 0 });

      expect(result.error).toBeUndefined();
      expect(result.data!.data.length).toBe(3);
      expect(result.data!.limit).toBe(3);
      expect(result.data!.offset).toBe(0);
    });

    it('type 筛选参数生效（type=0 仅返回本篇）', async () => {
      const result = await bgm.episodes.getEpisodes(8, { type: 0 });

      expect(result.error).toBeUndefined();
      const episodes = result.data!.data;
      expect(episodes.length).toBeGreaterThan(0);
      for (const ep of episodes) {
        expect(ep.type).toBe(0);
      }
    });

    it('传入 subject_id=0 返回 400', async () => {
      const result = await bgm.episodes.getEpisodes(0);

      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.response.status).toBe(400);
    });

    it('传入不存在的 subject_id 返回 404', async () => {
      const result = await bgm.episodes.getEpisodes(99999999);

      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.response.status).toBe(404);
    });
  });

  describe('getEpisodeById() — 章节详情', () => {
    // EVA 第一集 id=522（subject_id=8）
    it('返回 HTTP 200 且包含完整章节数据', async () => {
      const result = await bgm.episodes.getEpisodeById(522);

      expect(result.error).toBeUndefined();
      expect(result.data).toBeDefined();
    });

    it('返回数据包含所有必要字段（含 subject_id）', async () => {
      const result = await bgm.episodes.getEpisodeById(522);

      expect(result.error).toBeUndefined();
      const ep = result.data!;
      expect(typeof ep.id).toBe('number');
      expect(typeof ep.type).toBe('number');
      expect(typeof ep.name).toBe('string');
      expect(typeof ep.name_cn).toBe('string');
      expect(typeof ep.sort).toBe('number');
      expect(typeof ep.airdate).toBe('string');
      expect(typeof ep.comment).toBe('number');
      expect(typeof ep.duration).toBe('string');
      expect(typeof ep.desc).toBe('string');
      expect(typeof ep.disc).toBe('number');
      expect(typeof ep.subject_id).toBe('number');
    });

    it('返回数据的 subject_id 与所属条目一致', async () => {
      const result = await bgm.episodes.getEpisodeById(522);

      expect(result.error).toBeUndefined();
      expect(result.data!.subject_id).toBe(8);
      expect(result.data!.id).toBe(522);
    });

    it('传入 episode_id=0 返回 400', async () => {
      const result = await bgm.episodes.getEpisodeById(0);

      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.response.status).toBe(400);
    });

    it('传入不存在的 episode_id 返回 404', async () => {
      const result = await bgm.episodes.getEpisodeById(99999999);

      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.response.status).toBe(404);
    });
  });
});
