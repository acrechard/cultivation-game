<template>
  <div class="inventory">
    <el-page-header @back="$router.go(-1)" content="背包系统"></el-page-header>
    
    <el-row :gutter="20">
      <el-col :span="6">
        <el-card class="inventory-filters">
          <template #header>
            <span>物品筛选</span>
          </template>
          
          <el-form :model="filters" label-position="top">
            <el-form-item label="物品类型">
              <el-select 
                v-model="filters.type" 
                placeholder="请选择类型"
                clearable
                @change="loadInventory"
              >
                <el-option label="丹药" value="丹药"></el-option>
                <el-option label="装备" value="装备"></el-option>
                <el-option label="材料" value="材料"></el-option>
                <el-option label="功法秘籍" value="功法秘籍"></el-option>
                <el-option label="任务物品" value="任务物品"></el-option>
                <el-option label="其他" value="其他"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item label="稀有度">
              <el-select 
                v-model="filters.rarity" 
                placeholder="请选择稀有度"
                clearable
                @change="loadInventory"
              >
                <el-option label="普通" value="普通"></el-option>
                <el-option label="精良" value="精良"></el-option>
                <el-option label="稀有" value="稀有"></el-option>
                <el-option label="史诗" value="史诗"></el-option>
                <el-option label="传说" value="传说"></el-option>
              </el-select>
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="loadInventory" style="width: 100%;">刷新</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      
      <el-col :span="18">
        <el-card>
          <template #header>
            <div class="inventory-header">
              <span>我的背包</span>
              <div class="inventory-stats">
                <span>物品数量: {{ inventory.length }} / {{ maxCapacity }}</span>
                <el-button type="success" size="small" @click="openShop">商城</el-button>
              </div>
            </div>
          </template>
          
          <div class="inventory-grid">
            <div 
              v-for="item in inventory" 
              :key="item._id"
              class="inventory-slot"
              :class="{ 'equipped': item.equipped }"
              @click="selectItem(item)"
            >
              <div class="item-icon" :class="'rarity-' + item.rarity.toLowerCase()">
                <div class="item-image">{{ getItemIcon(item.type) }}</div>
                <div class="item-count" v-if="item.quantity && item.quantity > 1">x{{ item.quantity }}</div>
              </div>
              <div class="item-name">{{ item.name }}</div>
              <div class="item-level" v-if="item.level > 1">Lv.{{ item.level }}</div>
            </div>
            
            <!-- 空格子 -->
            <div 
              v-for="i in emptySlots" 
              :key="'empty-' + i"
              class="inventory-slot empty-slot"
            >
              <div class="empty-indicator">空</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 物品详情弹窗 -->
    <el-dialog
      v-model="showItemDetailDialog"
      :title="selectedItem ? selectedItem.name : '物品详情'"
      width="40%"
      :before-close="closeItemDetailDialog"
    >
      <div v-if="selectedItem" class="item-detail-content">
        <div class="item-header">
          <div class="item-icon-large" :class="'rarity-' + selectedItem.rarity.toLowerCase()">
            {{ getItemIcon(selectedItem.type) }}
          </div>
          <div class="item-basic-info">
            <h3>{{ selectedItem.name }}</h3>
            <div class="item-tags">
              <el-tag size="small" :type="getRarityTagType(selectedItem.rarity)">
                {{ selectedItem.rarity }}
              </el-tag>
              <el-tag size="small" type="info">{{ selectedItem.type }}</el-tag>
              <el-tag size="small" type="warning" v-if="selectedItem.subtype">
                {{ selectedItem.subtype }}
              </el-tag>
              <el-tag size="small" type="success" v-if="selectedItem.level > 1">
                Lv.{{ selectedItem.level }}
              </el-tag>
            </div>
          </div>
        </div>
        
        <div class="item-description">
          <p>{{ selectedItem.description }}</p>
        </div>
        
        <div class="item-attributes" v-if="selectedItem.attributes && hasAttributes(selectedItem.attributes)">
          <h4>属性加成</h4>
          <el-row :gutter="10">
            <el-col :span="8" v-if="selectedItem.attributes.hp > 0">
              <div class="attribute-item">
                <i class="el-icon-circle-check"></i> 生命值: +{{ selectedItem.attributes.hp }}
              </div>
            </el-col>
            <el-col :span="8" v-if="selectedItem.attributes.mp > 0">
              <div class="attribute-item">
                <i class="el-icon-water-cup"></i> 灵力: +{{ selectedItem.attributes.mp }}
              </div>
            </el-col>
            <el-col :span="8" v-if="selectedItem.attributes.attack > 0">
              <div class="attribute-item">
                <i class="el-icon-magic-stick"></i> 攻击: +{{ selectedItem.attributes.attack }}
              </div>
            </el-col>
            <el-col :span="8" v-if="selectedItem.attributes.defense > 0">
              <div class="attribute-item">
                <i class="el-icon-lock"></i> 防御: +{{ selectedItem.attributes.defense }}
              </div>
            </el-col>
            <el-col :span="8" v-if="selectedItem.attributes.speed > 0">
              <div class="attribute-item">
                <i class="el-icon-lightning"></i> 速度: +{{ selectedItem.attributes.speed }}
              </div>
            </el-col>
            <el-col :span="8" v-if="selectedItem.attributes.critRate > 0">
              <div class="attribute-item">
                <i class="el-icon-star-on"></i> 暴击率: +{{ (selectedItem.attributes.critRate * 100).toFixed(1) }}%
              </div>
            </el-col>
            <el-col :span="8" v-if="selectedItem.attributes.dodgeRate > 0">
              <div class="attribute-item">
                <i class="el-icon-guide"></i> 闪避率: +{{ (selectedItem.attributes.dodgeRate * 100).toFixed(1) }}%
              </div>
            </el-col>
            <el-col :span="8" v-if="selectedItem.attributes.woodAffinity > 0">
              <div class="attribute-item">
                <i class="el-icon-apple"></i> 木亲和: +{{ selectedItem.attributes.woodAffinity }}
              </div>
            </el-col>
            <el-col :span="8" v-if="selectedItem.attributes.fireAffinity > 0">
              <div class="attribute-item">
                <i class="el-icon-orange"></i> 火亲和: +{{ selectedItem.attributes.fireAffinity }}
              </div>
            </el-col>
            <el-col :span="8" v-if="selectedItem.attributes.earthAffinity > 0">
              <div class="attribute-item">
                <i class="el-icon-football"></i> 土亲和: +{{ selectedItem.attributes.earthAffinity }}
              </div>
            </el-col>
            <el-col :span="8" v-if="selectedItem.attributes.metalAffinity > 0">
              <div class="attribute-item">
                <i class="el-icon-medal"></i> 金亲和: +{{ selectedItem.attributes.metalAffinity }}
              </div>
            </el-col>
            <el-col :span="8" v-if="selectedItem.attributes.waterAffinity > 0">
              <div class="attribute-item">
                <i class="el-icon-watermelon"></i> 水亲和: +{{ selectedItem.attributes.waterAffinity }}
              </div>
            </el-col>
          </el-row>
        </div>
        
        <div class="item-effects" v-if="selectedItem.effects && selectedItem.effects.length > 0">
          <h4>特殊效果</h4>
          <div 
            v-for="(effect, idx) in selectedItem.effects" 
            :key="idx"
            class="effect-item"
          >
            <i class="el-icon-lightning"></i> 
            <span class="effect-name">{{ effect.name }}</span>: 
            <span class="effect-desc">{{ effect.description }}</span>
          </div>
        </div>
        
        <div class="item-usage-info">
          <div class="usage-type">
            <i class="el-icon-setting"></i> 使用方式: {{ selectedItem.usage }}
          </div>
          <div class="stack-info" v-if="selectedItem.stackable">
            <i class="el-icon-copy-document"></i> 叠加: {{ selectedItem.quantity || 1 }} / {{ selectedItem.maxStack }}
          </div>
          <div class="durability-info" v-if="selectedItem.durability && selectedItem.durability.max > 0">
            <i class="el-icon-timer"></i> 耐久: {{ selectedItem.durability.current }} / {{ selectedItem.durability.max }}
          </div>
        </div>
        
        <div class="item-price-info" v-if="selectedItem.price && (selectedItem.price.buyPrice > 0 || selectedItem.price.sellPrice > 0)">
          <div class="buy-price" v-if="selectedItem.price.buyPrice > 0">
            <i class="el-icon-wallet"></i> 购买价: {{ selectedItem.price.buyPrice }} 灵石
          </div>
          <div class="sell-price" v-if="selectedItem.price.sellPrice > 0">
            <i class="el-icon-money"></i> 出售价: {{ selectedItem.price.sellPrice }} 灵石
          </div>
        </div>
      </div>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="closeItemDetailDialog">关闭</el-button>
          <el-button 
            v-if="selectedItem && selectedItem.usage === '使用'" 
            type="primary" 
            @click="useItem(selectedItem._id)"
          >
            使用
          </el-button>
          <el-button 
            v-if="selectedItem && (selectedItem.type === '装备' || selectedItem.usage === '装备')" 
            type="success"
            @click="equipItem(selectedItem._id)"
          >
            {{ selectedItem.equipped ? '卸下' : '装备' }}
          </el-button>
          <el-button 
            v-if="selectedItem && selectedItem.price && selectedItem.price.sellPrice > 0" 
            type="warning"
            @click="sellItem(selectedItem._id)"
          >
            出售
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 商城弹窗 -->
    <el-dialog
      v-model="showShopDialog"
      title="修仙商城"
      width="60%"
    >
      <el-tabs v-model="shopTab">
        <el-tab-pane label="丹药" name="shop-potions">
          <div class="shop-items-grid">
            <div 
              v-for="item in shopPotions" 
              :key="item._id"
              class="shop-item"
              @click="selectShopItem(item)"
            >
              <div class="item-icon" :class="'rarity-' + item.rarity.toLowerCase()">
                {{ getItemIcon(item.type) }}
              </div>
              <div class="item-info">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-price">{{ item.price.buyPrice }} 灵石</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="装备" name="shop-equipment">
          <div class="shop-items-grid">
            <div 
              v-for="item in shopEquipment" 
              :key="item._id"
              class="shop-item"
              @click="selectShopItem(item)"
            >
              <div class="item-icon" :class="'rarity-' + item.rarity.toLowerCase()">
                {{ getItemIcon(item.type) }}
              </div>
              <div class="item-info">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-price">{{ item.price.buyPrice }} 灵石</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        
        <el-tab-pane label="材料" name="shop-materials">
          <div class="shop-items-grid">
            <div 
              v-for="item in shopMaterials" 
              :key="item._id"
              class="shop-item"
              @click="selectShopItem(item)"
            >
              <div class="item-icon" :class="'rarity-' + item.rarity.toLowerCase()">
                {{ getItemIcon(item.type) }}
              </div>
              <div class="item-info">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-price">{{ item.price.buyPrice }} 灵石</div>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      
      <template #footer>
        <el-button @click="showShopDialog = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  name: 'InventoryView',
  data() {
    return {
      inventory: [],
      maxCapacity: 50,
      filters: {
        type: '',
        rarity: ''
      },
      showItemDetailDialog: false,
      showShopDialog: false,
      shopTab: 'shop-potions',
      selectedItem: null,
      shopPotions: [
        {
          _id: 'pot-1',
          name: '回血丹',
          type: '丹药',
          subtype: '恢复类',
          rarity: '普通',
          description: '恢复少量生命值',
          usage: '使用',
          price: { buyPrice: 10, sellPrice: 5 },
          attributes: { hp: 50 }
        },
        {
          _id: 'pot-2',
          name: '回灵丹',
          type: '丹药',
          subtype: '恢复类',
          rarity: '普通',
          description: '恢复少量灵力值',
          usage: '使用',
          price: { buyPrice: 15, sellPrice: 8 },
          attributes: { mp: 30 }
        },
        {
          _id: 'pot-3',
          name: '聚气丹',
          type: '丹药',
          subtype: '修炼类',
          rarity: '稀有',
          description: '临时提升修炼效率',
          usage: '使用',
          price: { buyPrice: 100, sellPrice: 50 },
          effects: [{ name: '修炼加速', description: '修炼效率提升50%', duration: 3600 }]
        }
      ],
      shopEquipment: [
        {
          _id: 'eq-1',
          name: '青铜剑',
          type: '装备',
          subtype: '武器-剑',
          rarity: '普通',
          description: '普通的青铜剑，适合初学者',
          usage: '装备',
          price: { buyPrice: 50, sellPrice: 25 },
          attributes: { attack: 10 }
        },
        {
          _id: 'eq-2',
          name: '布衣',
          type: '装备',
          subtype: '防具-护甲',
          rarity: '普通',
          description: '普通的布衣，提供基础防护',
          usage: '装备',
          price: { buyPrice: 30, sellPrice: 15 },
          attributes: { defense: 5 }
        },
        {
          _id: 'eq-3',
          name: '青锋剑',
          type: '装备',
          subtype: '武器-剑',
          rarity: '精良',
          description: '锋利的铁剑，品质上乘',
          usage: '装备',
          price: { buyPrice: 200, sellPrice: 100 },
          attributes: { attack: 25 }
        }
      ],
      shopMaterials: [
        {
          _id: 'mat-1',
          name: '灵石碎片',
          type: '材料',
          subtype: '炼器材料',
          rarity: '普通',
          description: '蕴含微弱灵气的石头碎片',
          usage: '合成材料',
          price: { buyPrice: 5, sellPrice: 2 }
        },
        {
          _id: 'mat-2',
          name: '千年寒铁',
          type: '材料',
          subtype: '炼器材料',
          rarity: '稀有',
          description: '极寒之地开采的珍贵金属',
          usage: '合成材料',
          price: { buyPrice: 500, sellPrice: 250 }
        },
        {
          _id: 'mat-3',
          name: '清心草',
          type: '材料',
          subtype: '炼丹材料',
          rarity: '普通',
          description: '常见的炼丹药材',
          usage: '合成材料',
          price: { buyPrice: 8, sellPrice: 4 }
        }
      ]
    };
  },
  computed: {
    emptySlots() {
      const occupiedSlots = this.inventory.length;
      return Math.max(0, this.maxCapacity - occupiedSlots);
    }
  },
  methods: {
    getItemIcon(type) {
      const icons = {
        '丹药': '💊',
        '装备': '⚔️',
        '材料': '⛏️',
        '功法秘籍': '📜',
        '任务物品': '🎁',
        '其他': '📦'
      };
      return icons[type] || '📦';
    },
    getRarityTagType(rarity) {
      const types = {
        '普通': 'info',
        '精良': 'success',
        '稀有': 'warning',
        '史诗': 'danger',
        '传说': 'primary'
      };
      return types[rarity] || 'info';
    },
    hasAttributes(attributes) {
      return Object.values(attributes).some(value => value > 0);
    },
    async loadInventory() {
      try {
        // 模拟API调用
        this.inventory = [
          {
            _id: 'inv-1',
            name: '回血丹',
            type: '丹药',
            subtype: '恢复类',
            rarity: '普通',
            description: '恢复少量生命值',
            usage: '使用',
            quantity: 5,
            price: { buyPrice: 10, sellPrice: 5 },
            attributes: { hp: 50 }
          },
          {
            _id: 'inv-2',
            name: '青铜剑',
            type: '装备',
            subtype: '武器-剑',
            rarity: '普通',
            description: '普通的青铜剑，适合初学者',
            usage: '装备',
            equipped: true,
            price: { buyPrice: 50, sellPrice: 25 },
            attributes: { attack: 10 }
          },
          {
            _id: 'inv-3',
            name: '基础吐纳术',
            type: '功法秘籍',
            subtype: '功法',
            rarity: '普通',
            description: '最基础的修炼功法',
            usage: '阅读',
            price: { buyPrice: 100, sellPrice: 50 }
          },
          {
            _id: 'inv-4',
            name: '清心草',
            type: '材料',
            subtype: '炼丹材料',
            rarity: '普通',
            description: '常见的炼丹药材',
            usage: '合成材料',
            quantity: 12,
            price: { buyPrice: 8, sellPrice: 4 }
          },
          {
            _id: 'inv-5',
            name: '灵石碎片',
            type: '材料',
            subtype: '炼器材料',
            rarity: '普通',
            description: '蕴含微弱灵气的石头碎片',
            usage: '合成材料',
            quantity: 8,
            price: { buyPrice: 5, sellPrice: 2 }
          }
        ];
        
        // 应用筛选条件
        let filteredInventory = [...this.inventory];
        
        if (this.filters.type) {
          filteredInventory = filteredInventory.filter(item => item.type === this.filters.type);
        }
        
        if (this.filters.rarity) {
          filteredInventory = filteredInventory.filter(item => item.rarity === this.filters.rarity);
        }
        
        this.inventory = filteredInventory;
        
        ElMessage.success('背包信息加载成功');
      } catch (error) {
        ElMessage.error('加载背包信息失败');
      }
    },
    selectItem(item) {
      this.selectedItem = { ...item };
      this.showItemDetailDialog = true;
    },
    closeItemDetailDialog() {
      this.showItemDetailDialog = false;
      this.selectedItem = null;
    },
    async useItem(itemId) {
      try {
        const itemIndex = this.inventory.findIndex(item => item._id === itemId);
        if (itemIndex === -1) {
          ElMessage.error('物品不存在');
          return;
        }
        
        const item = this.inventory[itemIndex];
        if (item.usage !== '使用') {
          ElMessage.warning('该物品不能使用');
          return;
        }
        
        if (item.quantity && item.quantity > 1) {
          // 减少数量
          this.inventory[itemIndex].quantity -= 1;
          if (this.inventory[itemIndex].quantity <= 0) {
            this.inventory.splice(itemIndex, 1);
          }
        } else {
          // 移除物品
          this.inventory.splice(itemIndex, 1);
        }
        
        ElMessage.success(`使用了 ${item.name}`);
        this.closeItemDetailDialog();
      } catch (error) {
        ElMessage.error('使用物品失败');
      }
    },
    async equipItem(itemId) {
      try {
        const itemIndex = this.inventory.findIndex(item => item._id === itemId);
        if (itemIndex === -1) {
          ElMessage.error('物品不存在');
          return;
        }
        
        const item = this.inventory[itemIndex];
        if (item.type !== '装备' && item.usage !== '装备') {
          ElMessage.warning('该物品不能装备');
          return;
        }
        
        // 如果是装备操作
        if (item.equipped) {
          // 卸下装备
          this.inventory[itemIndex].equipped = false;
          ElMessage.success(`已卸下 ${item.name}`);
        } else {
          // 装备物品
          // 先卸下同类装备（简单处理，实际应该按部位区分）
          this.inventory.forEach(invItem => {
            if (invItem.type === '装备' && invItem.equipped) {
              invItem.equipped = false;
            }
          });
          
          this.inventory[itemIndex].equipped = true;
          ElMessage.success(`已装备 ${item.name}`);
        }
        
        this.closeItemDetailDialog();
      } catch (error) {
        ElMessage.error('装备操作失败');
      }
    },
    async sellItem(itemId) {
      try {
        await ElMessageBox.confirm(
          '确定要出售这件物品吗？',
          '确认出售',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }
        );
        
        const itemIndex = this.inventory.findIndex(item => item._id === itemId);
        if (itemIndex === -1) {
          ElMessage.error('物品不存在');
          return;
        }
        
        const item = this.inventory[itemIndex];
        if (!item.price || !item.price.sellPrice || item.price.sellPrice <= 0) {
          ElMessage.warning('该物品无法出售');
          return;
        }
        
        // 计算出售价格
        const sellPrice = item.price.sellPrice * (item.quantity || 1);
        
        // 移除物品
        this.inventory.splice(itemIndex, 1);
        
        ElMessage.success(`出售成功，获得 ${sellPrice} 灵石`);
        this.closeItemDetailDialog();
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('出售失败');
        }
      }
    },
    openShop() {
      this.showShopDialog = true;
    },
    selectShopItem(item) {
      ElMessage.info(`点击了商城物品: ${item.name}`);
    }
  },
  async mounted() {
    document.title = '文字修仙传 - 背包系统';
    await this.loadInventory();
  }
};
</script>

<style scoped lang="scss">
.inventory {
  padding: 20px;
}

.inventory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .inventory-stats {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 10px;
  min-height: 400px;
}

.inventory-slot {
  border: 2px solid #dcdfe6;
  border-radius: 8px;
  padding: 8px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #fafafa;
  
  &:hover {
    border-color: #409eff;
    background-color: #ecf5ff;
  }
  
  &.equipped {
    border: 2px solid #67c23a;
    background-color: #f0f9eb;
  }
  
  .item-icon {
    position: relative;
    width: 40px;
    height: 40px;
    margin: 0 auto 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    border-radius: 4px;
    
    &.rarity-普通 {
      background-color: #f4f4f5;
      border: 1px solid #d4d4d8;
    }
    
    &.rarity-精良 {
      background-color: #f0f9eb;
      border: 1px solid #a0d911;
    }
    
    &.rarity-稀有 {
      background-color: #e8f3ff;
      border: 1px solid #409eff;
    }
    
    &.rarity-史诗 {
      background-color: #f7e8fc;
      border: 1px solid #d351e0;
    }
    
    &.rarity-传说 {
      background-color: #fff3e8;
      border: 1px solid #ff7a45;
    }
    
    .item-count {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: #f56c6c;
      color: white;
      font-size: 12px;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  
  .item-name {
    font-size: 12px;
    margin-top: 2px;
    word-break: break-all;
  }
  
  .item-level {
    font-size: 10px;
    color: #909399;
    margin-top: 2px;
  }
}

.empty-slot {
  border: 2px dashed #dcdfe6;
  background-color: transparent;
  
  .empty-indicator {
    color: #c0c4cc;
  }
}

.item-detail-content {
  .item-header {
    display: flex;
    gap: 15px;
    margin-bottom: 15px;
    
    .item-icon-large {
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      border-radius: 8px;
      
      &.rarity-普通 { background-color: #f4f4f5; border: 1px solid #d4d4d8; }
      &.rarity-精良 { background-color: #f0f9eb; border: 1px solid #a0d911; }
      &.rarity-稀有 { background-color: #e8f3ff; border: 1px solid #409eff; }
      &.rarity-史诗 { background-color: #f7e8fc; border: 1px solid #d351e0; }
      &.rarity-传说 { background-color: #fff3e8; border: 1px solid #ff7a45; }
    }
    
    .item-basic-info {
      flex: 1;
      
      h3 {
        margin: 0 0 8px 0;
        color: #303133;
      }
      
      .item-tags {
        display: flex;
        gap: 5px;
        flex-wrap: wrap;
      }
    }
  }
  
  .item-description {
    padding: 10px;
    background-color: #f5f7fa;
    border-radius: 4px;
    margin-bottom: 15px;
    
    p {
      margin: 0;
      color: #606266;
      line-height: 1.5;
    }
  }
  
  .item-attributes {
    margin-bottom: 15px;
    
    h4 {
      margin: 0 0 10px 0;
      color: #303133;
      border-bottom: 1px solid #ebeef5;
      padding-bottom: 5px;
    }
    
    .attribute-item {
      padding: 5px 0;
      color: #606266;
      
      i {
        margin-right: 5px;
        color: #409eff;
      }
    }
  }
  
  .item-effects {
    margin-bottom: 15px;
    
    h4 {
      margin: 0 0 10px 0;
      color: #303133;
      border-bottom: 1px solid #ebeef5;
      padding-bottom: 5px;
    }
    
    .effect-item {
      padding: 5px 0;
      color: #e6a23c;
      
      i {
        margin-right: 5px;
      }
      
      .effect-name {
        font-weight: bold;
        color: #606266;
      }
      
      .effect-desc {
        color: #909399;
      }
    }
  }
  
  .item-usage-info, .item-price-info {
    margin-bottom: 10px;
    
    div {
      padding: 5px 0;
      color: #606266;
      
      i {
        margin-right: 5px;
        color: #409eff;
      }
    }
  }
  
  .buy-price {
    color: #67c23a;
  }
  
  .sell-price {
    color: #e6a23c;
  }
}

.shop-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 15px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px 0;
}

.shop-item {
  border: 1px solid #dcdfe6;
  border-radius: 8px;
  padding: 10px;
  cursor: pointer;
  transition: all 0.3s;
  background-color: #fff;
  
  &:hover {
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
  }
  
  display: flex;
  flex-direction: column;
  align-items: center;
  
  .item-icon {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    border-radius: 4px;
    margin-bottom: 8px;
  }
  
  .item-info {
    text-align: center;
    width: 100%;
    
    .item-name {
      font-weight: bold;
      margin-bottom: 4px;
      word-break: break-all;
    }
    
    .item-price {
      color: #e6a23c;
      font-size: 12px;
    }
  }
}

.dialog-footer {
  text-align: right;
}
</style>