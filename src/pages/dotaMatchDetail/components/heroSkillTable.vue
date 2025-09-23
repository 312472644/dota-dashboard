<template>
  <div class="hero-skill-table">
    <Collapse simple>
      <Panel>
        <span>{{ text }} 技能加点</span>
        <template #content>
          <Table class="table" :row-class-name="rowClassName" :columns="columns" :data="tableList">
            <template #player="{ row, index }">
              <hero-image :data="row" :color-index="index" />
            </template>
          </Table>
        </template>
      </Panel>
    </Collapse>
  </div>
</template>
<script setup>
import { watch, ref, onMounted, resolveComponent } from 'vue';
import { useRoute } from 'vue-router';
import talentTreeSVG from '@/assets/images/talent_tree.svg';
import lodash from 'lodash';
import axios from 'axios';
import heroImage from './heroImage.vue';

const props = defineProps({
  dataList: {
    type: Array,
    default: () => []
  },
  text: {
    type: String,
    default: ''
  }
});

const route = useRoute();
const tableList = ref([]);
const accountId = route.query.accountId;
const columns = ref([{ title: '玩家', slot: 'player', width: '180px' }]);

const getSkillList = async heroIdList => {
  const axiosList = [];
  heroIdList.forEach(element => {
    axiosList.push(axios.get(`https://www.dota2.com.cn/datafeed/hero?hero_id=${element}`));
  });
  const response = await Promise.all(axiosList);
  return response.map(item => item.data.result.heroes);
};

const getAbilityList = (dataList = [], skillList = []) => {
  const cloneList = lodash.cloneDeep(dataList);
  cloneList.forEach(item => {
    const { ability_upgrades_arr = [], hero_id } = item;
    const heroSkillDetail = skillList.find(skillItem => skillItem.id.toString() === hero_id.toString());
    const { abilities = [], talents } = heroSkillDetail;
    ability_upgrades_arr.forEach((id, index) => {
      const normalItem = [...abilities].find(el => el.id.toString() === id.toString());
      const talentItem = [...talents].find(el => el.id.toString() === id.toString());
      const skillName = 'skill_' + (index + 1);
      // 普通技能
      if (normalItem) {
        item[skillName] = { ...normalItem };
      }
      // 天赋技能
      else if (talentItem) {
        item[skillName] = {
          ...talentItem,
          img: talentTreeSVG
        };
      }
    });
    // 空技能
    if (ability_upgrades_arr.length >= 18) {
      item['skill_20'] = item['skill_19'];
      item['skill_18'] = item['skill_17'];
      item['skill_17'] = '';
      item['skill_19'] = '';
    }
    // 天赋升级
    if (ability_upgrades_arr.length === 19) {
      item['skill_25'] = { img: talentTreeSVG };
    }
  });
  tableList.value.push(...cloneList);
};

const initProps = async (dataList = []) => {
  const heroIdList = dataList.map(item => item.hero_id);
  const abilityList = await getSkillList(heroIdList);
  getAbilityList(dataList, abilityList);
};

const createColumns = () => {
  for (let i = 1; i <= 25; i++) {
    columns.value.push({
      title: i,
      width: '50px',
      render: (h, params) => {
        const skill = params.row[`skill_${i}`];
        if (skill) {
          return h(
            'div',
            {
              class: 'skill-logo'
            },
            [
              h(resolveComponent('Image'), {
                src: skill.img,
                width: '30px',
                fit: 'cover',
                lazy: true
              })
            ]
          );
        }
      }
    });
  }
};

const rowClassName = row => {
  return row?.account_id?.toString() === accountId ? 'current-player' : '';
};

const init = () => {
  createColumns();
};

watch(props, newValue => {
  initProps(newValue.dataList);
});

onMounted(() => {
  init();
});
</script>
<style lang="scss">
.hero-skill-table {
  margin-bottom: 10px;
  .title {
    font-size: 15px;
    font-weight: bold;
    padding-bottom: 10px;
  }
  .ivu-table-overflowX {
    overflow-x: scroll !important;
  }
  .inline-logo-box {
    position: relative;
    .table-image {
      margin-right: 10px;
    }
  }
  .skill-logo {
    .ivu-image-img {
      border-radius: 3px;
      cursor: pointer;
    }
    .ivu-image-inner {
      background: #333;
      border-radius: 3px;
    }
  }
  .current-player td {
    background-color: #f8f8f9;
  }
}
</style>
