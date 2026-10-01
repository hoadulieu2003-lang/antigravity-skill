# 📚 CHƯƠNG 07: CƠ SỞ DỮ LIỆU VECTOR VÀ CƠ CHẾ TRUY XUẤT THÔNG TIN CHO AI (VECTOR DATABASES & AI RETRIEVAL)

> **Thuộc Chiến dịch**: Database Architecture Masterclass  
> **Chuyên đề**: Pod 7 — Vector Database & AI Retrieval Specialist  
> **Chủ quản Hệ thống (Owner)**: Anh — Lead Architect / Product Owner  
> **Tác giả (Author)**: Em — Senior Engineering Agent (Antigravity)  
> **Cấp độ Kiến trúc**: Chuyên sâu Doanh nghiệp (`Enterprise Production-Grade`)  

---

## 📑 MỤC LỤC CHI TIẾT (TABLE OF CONTENTS)

1. [Không Gian Vector và Tìm Kiếm Độ Tương Đồng (Vector Space & Similarity Search)](#1-không-gian-vector-và-tìm-kiếm-độ-tương-đồng-vector-space--similarity-search)
   - 1.1 Bản chất của Vector Embeddings (Vectơ Nhúng) và Không Gian Biểu Diễn
   - 1.2 Chiều Không Gian (Dimensions) và Lời Nguyền Số Chiều (Curse of Dimensionality)
   - 1.3 Dense Vectors (Vectơ Dày Đặc) vs Sparse Vectors (Vectơ Thưa Thớt)
   - 1.4 Các Độ Đo Khoảng Cách Toán Học (Distance Metrics): Cosine, Euclidean ($L_2$), Dot Product ($IP$), Manhattan ($L_1$)
2. [Các Giải Thuật Lập Chỉ Mục Vector (Vector Indexing Algorithms - ANN)](#2-các-giải-thuật-lập-chỉ-mục-vector-vector-indexing-algorithms---ann)
   - 2.1 Flat Indexing (Exact Search - Tìm Kiếm Tuyệt Đối $O(N)$)
   - 2.2 IVFFlat (Inverted File Flat): Phân Cụm Voronoi & Cân Bằng nlist / nprobe
   - 2.3 HNSW (Hierarchical Navigable Small World): Cấu Trúc Đồ Thị Phân Tầng — Tiêu Chuẩn Vàng
   - 2.4 Kỹ Thuật Lượng Tử Hóa (Quantization): Scalar Quantization (SQ8) & Product Quantization (PQ)
3. [Bức Tranh Toàn Cảnh Hệ Thống Vector Database (Vector Database Landscape)](#3-bức-tranh-toàn-cảnh-hệ-thống-vector-database-vector-database-landscape)
   - 3.1 Standalone Vector DBs (Qdrant, Milvus, Chroma, Pinecone)
   - 3.2 Integrated Extension: PostgreSQL với pgvector
   - 3.3 Ma Trận Đánh Đổi Kiến Trúc (Architectural Trade-Off Matrix)
4. [Tìm Kiếm Lai & Lọc Dữ Liệu Nâng Cao (Hybrid Search & Filtered Vector Search)](#4-tìm-kiếm-lai--lọc-dữ-liệu-nâng-cao-hybrid-search--filtered-vector-search)
   - 4.1 Hybrid Search: Phối Hợp Dense Semantic + Sparse Keyword (BM25)
   - 4.2 Thuật Toán Hợp Nhất Thứ Hạng: Reciprocal Rank Fusion (RRF) & Cross-Encoder Reranker
   - 4.3 Các Chiến Lược Metadata Filtering: Pre-filtering, Post-filtering, Single-stage Graph Traversal
5. [Cấu Hình pgvector Chuẩn Production & Thiết Kế Kiến Trúc Thực Chiến](#5-cấu-hình-pgvector-chuẩn-production--thiết-kế-kiến-trúc-thực-chiến)
   - 5.1 Kịch Bản Khởi Tạo Bảng & Cấu Hình Bộ Nhớ pgvector Tối Ưu
   - 5.2 Xây Dựng HNSW Index & Tuning Runtime Parameters
   - 5.3 Triển Khai Truy Vấn Hybrid Search Tích Hợp RRF Bằng SQL Thuần
   - 5.4 Tổng Kết & Cẩm Nang Ra Quyết Định Kiến Trúc (Architecture Decision Playbook)

---

## 1. KHÔNG GIAN VECTOR VÀ TÌM KIẾM ĐỘ TƯƠNG ĐỒNG (VECTOR SPACE & SIMILARITY SEARCH)

### 1.1 Bản Chất của Vector Embeddings (Vectơ Nhúng) và Không Gian Biểu Diễn

Trong kỷ nguyên của Trí tuệ Nhân tạo Tạo sinh (`Generative AI`) và Xử lý Ngôn ngữ Tự nhiên (`Natural Language Processing - NLP`), phần lớn dữ liệu thế giới thực tồn tại dưới dạng **Phi cấu trúc (`Unstructured Data`)**: văn bản thuần, hình ảnh, video, âm thanh, đồ thị phân tử hoặc hành vi người dùng. Hệ quản trị cơ sở dữ liệu quan hệ truyền thống (`RDBMS`) chỉ có thể tìm kiếm dữ liệu này qua phép so khớp chuỗi ký tự chính xác (`Exact String Matching`) hoặc tìm kiếm toàn văn bản (`Full-Text Search - FTS`) dựa trên từ tố (`Lexical Tokens`).

**Vector Embedding (Vectơ nhúng)** là kỹ thuật ánh xạ một đối tượng dữ liệu phi cấu trúc phức tạp từ không gian gốc thành một điểm biểu diễn — một vectơ số thực $D$ chiều trong không gian Euclid đa chiều $\mathbb{R}^D$:

$$f: \mathcal{X} \to \mathbb{R}^D$$

Điểm cốt lõi của phép biến đổi này là **Bảo toàn Tính ngữ nghĩa theo Hình học (`Semantic Geometry Preservation`)**: Các thực thể có ý nghĩa tương đồng hoặc ngữ cảnh gần gũi trong thế giới thực sẽ được ánh xạ thành các vectơ nằm gần nhau trong không gian đa chiều, tuân theo giả thuyết phân phối (`Distributional Hypothesis`): *"Các từ xuất hiện trong ngữ cảnh tương tự sẽ có ý nghĩa tương tự"*.

```
   [Văn bản gốc: "Hoàng đế"]      ──► [Mô hình Embedding: text-embedding-3] ──► [ 0.241, -0.892, 0.015, ..., 0.612 ] ∈ ℝ¹⁵³⁶
   [Văn bản gốc: "Quốc vương"]    ──► [Mô hình Embedding: text-embedding-3] ──► [ 0.238, -0.885, 0.019, ..., 0.608 ] ∈ ℝ¹⁵³⁶
   [Văn bản gốc: "Quả chuối"]     ──► [Mô hình Embedding: text-embedding-3] ──► [-0.712,  0.104, 0.884, ..., -0.193] ∈ ℝ¹⁵³⁶
```

Phép tính đại số nổi tiếng trong mô hình Word2Vec minh họa tính chất đại số tuyến tính của không gian vector:
$$\vec{v}_{\text{King}} - \vec{v}_{\text{Man}} + \vec{v}_{\text{Woman}} \approx \vec{v}_{\text{Queen}}$$

---

### 1.2 Chiều Không Gian (Dimensions) và Lời Nguyền Số Chiều (Curse of Dimensionality)

#### 1.2.1 Kích Thước Chiều Không Gian Thường Gặp
Số chiều ($D$ hoặc $Dim$) đại diện cho số lượng tọa độ số thực (thường là `float32` - 4 bytes mỗi chiều) dùng để mô tả thực thể:
- **$D = 384$**: Mô hình nhẹ, tối ưu cho CPU / On-device (`sentence-transformers/all-MiniLM-L6-v2`).
- **$D = 768$**: Mô hình chuẩn Transformer cơ bản (`bert-base-uncased`, `text-embedding-bge-base`).
- **$D = 1024$**: Mô hình đa ngôn ngữ chất lượng cao (`bge-large-en-v1.5`, `multilingual-e5-large`).
- **$D = 1536$**: Mô hình thương mại phổ biến của OpenAI (`text-embedding-ada-002`, `text-embedding-3-small`).
- **$D = 3072$**: Mô hình biểu diễn sâu cao cấp (`text-embedding-3-large`).
- **$D = 4096$**: Lớp ẩn cuối (`Last Hidden State`) của các Mô hình Ngôn ngữ Lớn (`LLM`) như Llama 3 8B.

#### 1.2.2 Lời Nguyền Số Chiều (Curse of Dimensionality) Trong Tìm Kiếm
Khi số chiều $D$ tăng từ vài chục lên hàng nghìn, các trực giác hình học thông thường trong không gian 2D/3D hoàn toàn bị sụp đổ bởi hai hiện tượng toán học:

1. **Sự Tập Trung Khoảng Cách (Distance Concentration Effect)**:
   Khi số chiều $D \to \infty$, khoảng cách giữa điểm truy vấn tới điểm lân cận gần nhất ($d_{\min}$) và khoảng cách tới điểm xa nhất ($d_{\max}$) có xu hướng tiệm cận nhau:
   $$\lim_{D \to \infty} \frac{d_{\max} - d_{\min}}{d_{\min}} \to 0$$
   Điều này khiến cho mọi điểm dữ liệu trong không gian dường như "cách đều" điểm truy vấn, làm suy giảm khả năng phân biệt lân cận của các hàm khoảng cách chuẩn.
2. **Sự Phình To Không Gian (Exponential Volume Expansion)**:
   Thể tích của không gian tăng theo hàm mũ $O(2^D)$. Dữ liệu trở nên cực kỳ thưa thớt (`Hyperspace Sparsity`). Để bao phủ một tỷ lệ phần trăm thể tích cố định, bán kính tìm kiếm phải nở rộng gần như chạm tới toàn bộ không gian, khiến các cấu trúc phân chia không gian truyền thống như K-d Tree hay R-Tree bị thoái hóa thành quét tuần tự ($O(N)$).

---

### 1.3 Dense Vectors (Vectơ Dày Đặc) vs Sparse Vectors (Vectơ Thưa Thớt)

Trong kỹ thuật truy xuất thông tin (`Information Retrieval - IR`), hai trường phái biểu diễn vector bổ trợ mật thiết cho nhau:

```
+---------------------------------------------------------------------------------------------------------+
|                                    SO SÁNH DENSE VECTƠ VS SPARSE VECTƠ                                  |
+-----------------------+-------------------------------------------+-------------------------------------+
| Đặc tính              | Dense Vectors (Vectơ Dày Đặc)             | Sparse Vectors (Vectơ Thưa Thớt)    |
+-----------------------+-------------------------------------------+-------------------------------------+
| Bản chất giá trị      | Đa số các chiều đều mang giá trị khác 0   | Hầu hết các chiều bằng 0 (> 99.5%)  |
|                       | (ví dụ: [0.12, -0.45, 0.88, ...])         | Chỉ lưu cặp {index: value}          |
+-----------------------+-------------------------------------------+-------------------------------------+
| Kích thước không gian | Cố định, thường từ 384 đến 3072 chiều     | Cực lớn, tương đương từ điển        |
|                       |                                           | (|V| = 30,000 đến 250,000+ chiều)   |
+-----------------------+-------------------------------------------+-------------------------------------+
| Nguồn gốc sinh ra     | Mô hình Deep Neural Networks, Transformers| BM25, TF-IDF, SPLADE                |
|                       | (OpenAI, BGE, Cohere, Sentence-BERT)      | (Lexical & Learned Sparse Models)   |
+-----------------------+-------------------------------------------+-------------------------------------+
| Năng lực ngữ nghĩa    | Hiểu ngữ nghĩa trừu tượng, khái niệm      | Tìm chính xác từ khóa (`Exact Word`)|
|                       | đồng nghĩa, đa ngữ (`Cross-lingual`)      | Mã định danh, mã lỗi, tên riêng     |
+-----------------------+-------------------------------------------+-------------------------------------+
| Điểm yếu chết người   | Bỏ sót từ khóa hiếm, số hiệu cụ thể,      | Không hiểu từ đồng nghĩa, bất lực   |
|                       | dễ gặp hiện tượng "ảo giác ngữ nghĩa"     | trước hiện tượng đa từ cùng nghĩa   |
+-----------------------+-------------------------------------------+-------------------------------------+
| Cấu trúc chỉ mục      | HNSW, IVFFlat, ScaNN, DiskANN             | Inverted Index (Chỉ mục đảo)        |
+-----------------------+-------------------------------------------+-------------------------------------+
```

---

### 1.4 Các Độ Đo Khoảng Cách Toán Học (Distance Metrics)

Việc lựa chọn đúng hàm đo khoảng cách (`Distance Metric`) quyết định trực tiếp tới tính chính xác và hiệu năng tính toán của hệ thống. Dưới đây là 4 độ đo kinh điển:

```
                            CÁC ĐỘ ĐO KHOẢNG CÁCH TOÁN HỌC (DISTANCE METRICS)
  
       Cosine Distance (Góc Cosin)                  Euclidean Distance (Khoảng cách L2)
             v                                                  v
             ▲  θ                                               ▲
             │ ╱                                                │   d(u,v) = ||u - v||
             │╱                                                 ├───►●
             └────► u                                           │   ╱  u
       Chỉ đo góc θ, bỏ qua độ dài                        └──●┴─────►
                                                           Đo đường thẳng thực tế
  
       Dot Product (Tích vô hướng IP)               Manhattan Distance (Khoảng cách L1)
              u · v = ||u|| ||v|| cos(θ)                                 ● v
       Chịu ảnh hưởng bởi cả góc θ                         │    ┌─────┘
       và độ lớn (magnitude) của vector                     │    │ |u_y - v_y|
                                                           │ u  │
                                                           └──●─┴─────►
                                                              |u_x - v_x|
```

#### 1.4.1 Cosine Similarity & Cosine Distance (Góc Cosin)
- **Công thức Toán học**:
  $$\text{Cosine Similarity}(u, v) = \frac{u \cdot v}{\|u\|_2 \|v\|_2} = \frac{\sum_{i=1}^D u_i v_i}{\sqrt{\sum_{i=1}^D u_i^2} \sqrt{\sum_{i=1}^D v_i^2}} \in [-1, 1]$$
  $$\text{Cosine Distance}(u, v) = 1 - \text{Cosine Similarity}(u, v) \in [0, 2]$$
- **Bản chất**: Đo góc $\theta$ giữa hai vectơ trong không gian. Hai vectơ cùng hướng có Cosine = 1 (khoảng cách = 0); vuông góc có Cosine = 0; ngược hướng có Cosine = -1. Độ lớn (độ dài) của văn bản không làm thay đổi góc của vectơ.
- **Trường hợp sử dụng (`Use Cases`)**: Tìm kiếm văn bản ngữ nghĩa, tài liệu dài ngắn không đều, tài liệu dịch thuật.

#### 1.4.2 Euclidean Distance / $L_2$ Distance (Khoảng cách Euclid)
- **Công thức Toán học**:
  $$d_{L_2}(u, v) = \|u - v\|_2 = \sqrt{\sum_{i=1}^D (u_i - v_i)^2}$$
  Trong thực tế tính toán xếp hạng, hệ thống thường dùng **Squared Euclidean Distance ($L_2^2$)** để triệt tiêu phép lấy căn bậc hai đắt đỏ:
  $$d_{L_2^2}(u, v) = \sum_{i=1}^D (u_i - v_i)^2$$
- **Mối quan hệ tương đương với Cosine khi Vector đã Chuẩn Hóa (`Normalized Vectors`)**:
  Nếu tất cả vector đều có chuẩn đơn vị ($\|u\|_2 = 1$ và $\|v\|_2 = 1$):
  $$\|u - v\|_2^2 = \|u\|_2^2 + \|v\|_2^2 - 2(u \cdot v) = 1 + 1 - 2\cos(\theta) = 2(1 - \cos(\theta))$$
  > **Quy tắc Kiến trúc Cốt lõi**: Khi các vectơ được chuẩn hóa trước về độ dài đơn vị ($\|u\| = 1$), việc xếp hạng theo Khoảng cách Euclid ($L_2$), Khoảng cách Cosin, và Tích vô hướng ($IP$) cho ra **kết quả thứ tự hoàn toàn giống nhau 100%**.
- **Trường hợp sử dụng (`Use Cases`)**: Thị giác máy tính (`Computer Vision`), nhận diện khuôn mặt (`Face Recognition`), phân cụm âm thanh.

#### 1.4.3 Dot Product / Inner Product ($IP$ - Tích Vô Hướng)
- **Công thức Toán học**:
  $$\langle u, v \rangle = u \cdot v = \sum_{i=1}^D u_i v_i$$
  Để chuyển đổi sang khoảng cách nghịch đảo phục vụ tìm kiếm lân cận nhỏ nhất:
  $$\text{IP Distance}(u, v) = - (u \cdot v) \quad \text{hoặc} \quad 1 - (u \cdot v)$$
- **Bản chất**: Đo cả góc lẫn độ lớn của vectơ. Một đối tượng có độ lớn $\|v\|$ cao hơn sẽ đạt điểm số cao hơn nếu cùng góc chiếu.
- **Trường hợp sử dụng (`Use Cases`)**: Hệ thống gợi ý (`Recommendation Systems`), mô hình ma trận nhân tử hóa (`Matrix Factorization`), Two-Tower Models nơi độ dài biểu diễn mức độ nổi tiếng (`Popularity`) hoặc độ tin cậy của sản phẩm.

#### 1.4.4 Manhattan Distance / $L_1$ Distance (Khoảng Cách City Block)
- **Công thức Toán học**:
  $$d_{L_1}(u, v) = \|u - v\|_1 = \sum_{i=1}^D |u_i - v_i|$$
- **Bản chất**: Tổng các đoạn chênh lệch tuyệt đối trên từng trục tọa độ. Nhờ không áp dụng phép bình phương khoảng cách, $L_1$ ít nhạy cảm với các điểm dữ liệu dị biệt (`Outliers`) hơn so với $L_2$.
- **Trường hợp sử dụng (`Use Cases`)**: Phân tích dữ liệu cảm biến đa chiều, không gian biểu diễn rời rạc, nhận dạng cử chỉ.

---

## 2. CÁC GIẢI THUẬT LẬP CHỈ MỤC VECTOR (VECTOR INDEXING ALGORITHMS - ANN)

Tìm kiếm lân cận gần nhất chính xác (`Exact Nearest Neighbors - KNN`) đòi hỏi tính toán khoảng cách giữa query với toàn bộ $N$ vector trong kho dữ liệu ($O(N \cdot D)$). Khi $N$ đạt từ hàng triệu đến hàng tỷ, KNN trở nên bất khả thi về mặt độ trễ. 

Các giải thuật **Tìm Kiếm Lân Cận Gần Đúng (Approximate Nearest Neighbors - ANN)** ra đời để chấp nhận đánh đổi một tỷ lệ sai số rất nhỏ về độ hồi tưởng (`Recall`, thường duy trì $\ge 95\% - 99\%$) để đổi lấy tốc độ truy vấn nhanh gấp hàng trăm tới hàng nghìn lần ($O(\log N)$ hoặc $O(1)$).

```
+----------------------------------------------------------------------------------------------------+
|                           QUAN HỆ ĐÁNH ĐỔI GIỮA CÁC GIẢI THUẬT ANN INDEX                               |
+------------------+------------------+--------------------+--------------------+--------------------+
| Giải thuật       | Tốc độ Query     | Tiêu thụ RAM       | Tốc độ Build Index | Độ Hồi Tưởng       |
+------------------+------------------+--------------------+--------------------+--------------------+
| Flat (KNN)       | Rất chậm O(N)    | Rất thấp (Chỉ data)| Tức thì O(0)       | Hoàn hảo (100%)    |
| IVFFlat          | Trung bình O(K)  | Thấp (Data + Cent) | Nhanh (K-means)    | Trung bình (85-95%)|
| HNSW             | Cực nhanh O(logN)| Rất cao (Đồ thị)   | Chậm (Graph Build) | Xuất sắc (95-99.9%)|
| IVFPQ / HNSW+PQ  | Siêu nhanh       | Cực thấp (Nén 16x) | Rất chậm (Codebook)| Tốt (88-96%)       |
+------------------+------------------+--------------------+--------------------+--------------------+
```

---

### 2.1 Flat Indexing (Exact Search - Tìm Kiếm Tuyệt Đối $O(N)$)

Flat Index thực chất là một cấu trúc mảng tuần tự không xây dựng chỉ mục phụ trợ (`Zero Indexing`). Khi có truy vấn $q$:
1. Đọc tuần tự từng vector $v_i$ trong bộ nhớ hoặc ổ đĩa.
2. Tính khoảng cách $d(q, v_i)$ sử dụng chỉ thị phần cứng tăng tốc SIMD (`AVX-512`, `ARM Neon`).
3. Duy trì một hàng đợi ưu tiên (`Min-Heap` hoặc `Max-Heap`) kích thước $k$ để lưu $k$ phần tử gần nhất.

```
Query q ───► [ So sánh SIMD ] ───► v₁  (d = 0.42)
             [    với toàn   ] ───► v₂  (d = 0.89)  ──► Heap kích thước k ──► Top-k Kết Quả
             [   bộ mảng     ] ───► ...
             [    O(N · D)   ] ───► vₙ  (d = 0.15)
```

- **Độ phức tạp**: $O(N \cdot D)$.
- **Ưu điểm**: Recall luôn đạt 100% tuyệt đối. Không mất thời gian build index. Dữ liệu thêm/sửa/xóa tức thời không lo phân mảnh chỉ mục.
- **Nhược điểm**: Bất khả thi ở quy mô lớn. Với $N = 10,000,000$ và $D = 1536$, một truy vấn đòi hỏi $1.536 \times 10^{10}$ phép tính nhân cộng số thực, độ trễ vượt ngưỡng vài giây.

---

### 2.2 IVFFlat (Inverted File Flat): Phân Cụm Voronoi & Cân Bằng nlist / nprobe

IVFFlat giải quyết bài toán quy mô bằng cách chia không gian đa chiều thành các cụm Voronoi thông qua thuật toán $K$-Means Clustering:

```
                              KHÔNG GIAN VORONOI TRONG IVFFLAT
  
      +-----------------------------------------+
      |        .     .       |   .       .      |
      |   .       C₁    .    |        C₂     .  |   C₁, C₂, C₃, C₄: Tâm cụm (Centroids)
      |      .        .      |    .         .   |   nlist = 4 (Số phân vùng Voronoi)
      |----------------------+------------------|
      |   .       .     * q  |         .        |   q: Điểm truy vấn
      |       C₃     .       |   .        C₄    |   nprobe = 2:
      |    .       .         |        .      .  |   Chỉ quét các điểm trong C₃ và C₁!
      +-----------------------------------------+
```

#### 2.2.1 Cơ Chế Hoạt Động 3 Giai Đoạn
1. **Huấn luyện (Training Phase)**: Chọn một tập con dữ liệu ngẫu nhiên, chạy thuật toán $K$-Means để xác định `nlist` tâm cụm (`Centroids`).
2. **Lập chỉ mục (Indexing Phase)**: Mỗi vector trong cơ sở dữ liệu được so sánh với `nlist` centroids, gán vào centroid gần nhất và lưu trữ trong một Danh sách đảo (`Inverted List`) tương ứng với centroid đó.
3. **Truy vấn (Query Phase)**:
   - Tính khoảng cách từ vector truy vấn $q$ tới toàn bộ `nlist` centroids.
   - Chọn ra `nprobe` centroids gần $q$ nhất.
   - Chỉ quét vét (`Brute-force scan`) các vector nằm trong danh sách đảo của `nprobe` centroids này.

#### 2.2.2 Cân Bằng Trade-Off Giữa Tốc Độ và Độ Hồi Tưởng (`Recall`)
- **Tham số `nlist` (Số lượng Voronoi cells)**:
  - Nếu `nlist` quá nhỏ: Mỗi danh sách đảo chứa quá nhiều vector $\to$ Tốc độ quét bị chậm.
  - Nếu `nlist` quá lớn: Thời gian so khớp query với centroids tăng lên, thời gian build index kéo dài, đòi hỏi tập training phải đủ lớn để tránh hiện tượng cụm rỗng (`Empty clusters`).
  - *Công thức khuyến nghị thực tế*:
    $$\text{nlist} \approx 4\sqrt{N} \quad \text{cho} \quad N < 1,000,000$$
    $$\text{nlist} \approx 16\sqrt{N} \quad \text{cho} \quad N \ge 1,000,000$$
- **Tham số `nprobe` (Số lượng ô quét khi query)**:
  - `nprobe = 1`: Tốc độ nhanh nhất nhưng Recall thấp nhất (dễ bỏ sót các điểm nằm sát biên giới ô Voronoi lân cận).
  - Tăng `nprobe`: Tăng tỷ lệ tìm thấy lân cận thật sự (Recall tăng tiệm cận 100%), nhưng độ trễ tăng tuyến tính theo số ô phải quét. Khi `nprobe = nlist`, IVFFlat thoái hóa về Flat Search.

---

### 2.3 HNSW (Hierarchical Navigable Small World): Cấu Trúc Đồ Thị Phân Tầng — Tiêu Chuẩn Vàng

HNSW hiện là thuật toán chỉ mục ANN phổ biến và mạnh mẽ nhất thế giới (được áp dụng trong Qdrant, Milvus, pgvector, Faiss, Lucene). HNSW giải quyết triệt để vấn đề "kẹt tại cực tiểu cục bộ (`Local Minima`)" của đồ thị không gian phẳng bằng cách kết hợp nguyên lý **SkipList** (Danh sách nhảy) với **Đồ thị Thế giới Nhỏ Điều hướng (Navigable Small World Graph)**.

```
                         SƠ ĐỒ KIẾN TRÚC ĐỒ THỊ PHÂN TẦNG HNSW
  
  [Layer 2] (Thưa thớt nhất)
      (Enter Point EP)
           [A] ──────────────────────────────────────────────► [B]
            │                                                   │
  ══════════╪═══════════════════════════════════════════════════╪═══════════════════════════
  [Layer 1] │ (Mật độ trung bình)                               │
           [A] ─────────────► [C] ─────────────► [D] ─────────► [B]
            │                  │                  │              │
  ══════════╪══════════════════╪══════════════════╪══════════════╪═══════════════════════════
  [Layer 0] │ (Chứa toàn bộ N vectors - Mật độ dày nhất)        │
           [A] ──► [E] ──► [C] ──► [F] ──► [D] ──► [G] ──► [B] ──► [q] (Đích đến gần nhất)
```

#### 2.3.1 Cơ Chế Định Tuyến Tham Lam (Greedy Routing Across Layers)
1. **Tìm kiếm từ tầng đỉnh (`Top Layer - Layer L`)**: Quá trình bắt đầu tại điểm vào cố định (`Entry Point - EP`). Thuật toán thực hiện tìm kiếm tham lam (`Greedy Search`): Di chuyển dọc theo các cạnh tầm xa (`Long-range links`) có bước nhảy lớn để nhanh chóng tiếp cận vùng không gian chứa query $q$.
2. **Hạ tầng dần xuống (`Cascading Down`)**: Khi không thể tìm thấy nút nào ở tầng hiện tại gần $q$ hơn nút hiện hành, thuật toán hạ xuống tầng bên dưới ngay tại nút đó và tiếp tục tìm kiếm với bước nhảy ngắn hơn.
3. **Tinh chỉnh tại tầng đáy (`Layer 0`)**: Tầng 0 chứa 100% các điểm dữ liệu trong hệ thống. Tại đây, thuật toán duyệt qua các liên kết lân cận cục bộ dày đặc để thu thập đủ $k$ láng giềng gần nhất.

#### 2.3.2 Các Tham Số Kiến Trúc Sống Còn của HNSW
- **$M$ (Số lượng liên kết tối đa của mỗi node, thường từ 16 đến 64)**:
  - Xác định số lượng láng giềng mà mỗi nút kết nối ở các tầng $1 \dots L$. Riêng tầng 0 thường được gán $M_0 = 2M$ để tăng độ kết nối đáy.
  - $M$ càng cao: Đồ thị càng bền vững, Recall càng cao, nhưng tiêu tốn thêm bộ nhớ RAM cho con trỏ cạnh và tăng thời gian build.
- **$efConstruction$ (Kích thước danh sách ứng viên khi XÂY DỰNG đồ thị)**:
  - Khi chèn một vector mới vào đồ thị, thuật toán duy trì một danh sách ưu tiên kích thước $efConstruction$ để đánh giá các láng giềng tiềm năng.
  - $efConstruction$ càng cao: Đồ thị xây dựng càng chính xác, tỷ lệ Recall tối đa có thể đạt được càng lớn, nhưng thời gian index tăng đáng kể. Giá trị sản xuất khuyến nghị: $64 - 256$.
- **$efSearch$ (Kích thước danh sách ứng viên khi TRUY VẤN)**:
  - Tham số động tại thời điểm query. Điều khiển độ sâu của hàng đợi tìm kiếm tham lam tại Layer 0.
  - $efSearch \ge k$ (số lượng kết quả cần lấy). Tăng $efSearch$ giúp cải thiện Recall ngay lập tức mà không cần build lại index. Giá trị khuyến nghị: $40 - 200$.

#### 2.3.3 Vì Sao HNSW Trở Thành "Tiêu Chuẩn Vàng"?
- **Độ phức tạp tiệm cận**: Tìm kiếm đạt tốc độ logarithmic $O(\log N)$.
- **Độ hồi tưởng xuất sắc**: Dễ dàng đạt Recall $> 98\%$ trên các bộ dữ liệu thực tế lớn hàng chục triệu vector.
- **Phi tham số về phân phối (`Distribution-free`)**: Không giả định dữ liệu phân bố theo cụm hình cầu như K-Means của IVF; tự thích ứng với các cấu trúc hình học phức tạp (Manifolds) trong không gian embedding.

---

### 2.4 Kỹ Thuật Lượng Tử Hóa (Quantization): Scalar Quantization (SQ8) & Product Quantization (PQ)

#### 2.4.1 Động Lực: Cuộc Khủng Hoảng Bộ Nhớ RAM
Hãy tính toán chi phí RAM lưu trữ cho **10,000,000 vectors** kích thước $D = 1536$ chuẩn `float32`:
- Dữ liệu vector thô: $10^7 \times 1536 \times 4 \text{ bytes} \approx \mathbf{61.44 \text{ GB RAM}}$.
- Đồ thị HNSW ($M = 32$, con trỏ cạnh + metadata): Thêm $\approx \mathbf{25 - 40 \text{ GB RAM}}$.
- **Tổng cộng**: Cần tới gần **100 GB RAM** cho chỉ 10 triệu vector! Chi phí phần cứng máy chủ (`High Memory Cloud Instances`) sẽ trở thành rào cản chi phí khổng lồ. Kỹ thuật lượng tử hóa ra đời để nén dữ liệu từ 4x tới 16x.

```
                              SO SÁNH CÁC KỸ THUẬT LƯỢNG TỬ HÓA
  
  [Gốc float32]  : [ 0.1423, -0.8912, 0.0512, ..., 0.7712 ]  (1536 × 4 bytes = 6144 bytes)
                          │
                          ▼
  [SQ8 - int8]   : [  145  ,    12  ,   134  , ...,   220  ]  (1536 × 1 byte  = 1536 bytes)  ──► Nén 4x
                          │
                          ▼
  [PQ - m=96]    : [ Code 14, Code 201, ..., Code 88 ]         (96 × 1 byte    = 96 bytes)    ──► Nén 64x!
```

#### 2.4.2 Scalar Quantization (SQ8 - Lượng Tử Hóa Vô Hướng)
SQ8 ánh xạ độc lập từng tọa độ số thực 32-bit (`float32`) sang số nguyên 8-bit không dấu (`uint8` từ 0 đến 255):
$$x_{\text{int8}} = \text{round}\left( \frac{x - x_{\min}}{x_{\max} - x_{\min}} \times 255 \right)$$
- **Tỷ lệ nén**: Đúng **4 lần** (từ 4 bytes xuống 1 byte mỗi chiều).
- **Mức độ suy giảm Recall**: Rất thấp, thông thường chỉ mất từ **$0.5\% - 1.5\%$ Recall** so với float32.
- **Tính toán khoảng cách**: Các vi kiến trúc CPU hiện đại (như Intel AVX-512 VNNI, ARM DotProduct) hỗ trợ chỉ thị tính tích vô hướng của 2 vector `int8` trong một chu kỳ xung nhịp, tăng tốc độ tính toán lên gấp 2-3 lần.

#### 2.4.3 Product Quantization (PQ - Lượng Tử Hóa Tích)
PQ là giải pháp nén cực hạn, phân rã không gian vector thành tích các không gian con có số chiều thấp hơn:

1. **Chia không gian con**: Cắt vector $D$ chiều thành $m$ đoạn sub-vectors liên tiếp, mỗi đoạn có độ dài $d^* = D / m$.
2. **Huấn luyện Codebook**: Chạy $K$-Means độc lập trên từng không gian con để tìm ra $k^* = 256$ centroids (vừa vặn biểu diễn bằng 1 byte = 8 bits). Ma trận các centroids này gọi là **Codebook**.
3. **Mã hóa Vector (Quantization)**: Mỗi sub-vector được thay thế bằng chỉ số ID ($0 \dots 255$) của centroid gần nó nhất.
4. **Asymmetric Distance Computation (ADC - Tính khoảng cách bất đối xứng)**:
   Khi truy vấn với vector $q$ (giữ nguyên ở định dạng `float32` để bảo toàn độ chính xác):
   - Tính trước bảng khoảng cách từ các sub-vectors của $q$ tới 256 centroids của từng codebook $\to$ Tạo thành bảng tra cứu cục bộ (**Look-Up Table - LUT** kích thước $m \times 256$).
   - Khoảng cách từ $q$ tới bất kỳ vector nào trong kho dữ liệu chỉ đơn giản là phép cộng $m$ giá trị tra bảng từ LUT:
     $$d(q, v) \approx \sum_{j=1}^m \text{LUT}[j][\text{code}_j(v)]$$
   - Không cần giải nén vector, tốc độ tính toán đạt hàng chục triệu vector mỗi giây.

---

## 3. BỨC TRANH TOÀN CẢNH HỆ THỐNG VECTOR DATABASE (VECTOR DATABASE LANDSCAPE)

Thị trường công nghệ hiện nay chia làm hai trường phái rõ rệt: **Cơ sở dữ liệu Vector Chuyên dụng (`Standalone Vector DBs`)** và **Phần mở rộng tích hợp trên CSDL Quan hệ (`Integrated Extensions`)**.

```
                           BẢN ĐỒ KIẾN TRÚC VECTOR DATABASE
  
        STANDALONE VECTOR DATABASES                   INTEGRATED EXTENSIONS
    (Qdrant, Milvus, Pinecone, Chroma)                 (PostgreSQL + pgvector)
  
  ┌─────────────────────────────────────┐       ┌─────────────────────────────────────┐
  │         Application Layer           │       │         Application Layer           │
  └──────────────┬──────────────────────┘       └──────────────────┬──────────────────┘
                 │                                                 │
        ┌────────┴────────┐                               ┌────────┴────────┐
        ▼                 ▼                               ▼                 ▼
  ┌───────────┐     ┌───────────┐                   ┌─────────────────────────────────┐
  │ Relational│     │Dedicated  │                   │      PostgreSQL Database        │
  │ Database  │     │Vector DB  │                   │  ┌────────────┐ ┌─────────────┐ │
  │ (Postgres)│     │(Qdrant)   │                   │  │ Core Data  │ │ pgvector    │ │
  │ Metadata  │     │Vectors    │                   │  │ (ACID/Rel) │ │ (HNSW/IVF)  │ │
  └───────────┘     └───────────┘                   │  └────────────┘ └─────────────┘ │
   [Hai hệ thống độc lập - Cần ETL]                 └─────────────────────────────────┘
   [Nguy cơ không đồng bộ dữ liệu]                   [Một hệ thống duy nhất - 100% ACID]
```

---

### 3.1 Standalone Vector DBs (Qdrant, Milvus, Chroma, Pinecone)

#### 1. Qdrant (Rust Engine)
- **Đặc trưng**: Viết hoàn toàn bằng Rust, tối ưu hóa bộ nhớ cấp thấp, hỗ trợ lưu trữ vector trên ổ đĩa SSD qua `Memory-Mapped Files (mmap)` kết hợp payload indexing.
- **Điểm mạnh nhất**: Cơ chế **Filtered HNSW** (Single-stage filter) vượt trội nhất hiện nay. Cho phép đánh index trên từng trường metadata (Payload) và tích hợp trực tiếp vào đồ thị HNSW.
- **Mô hình triển khai**: Open-source, Docker tự lưu trữ (`Self-hosted`) hoặc Qdrant Cloud.

#### 2. Milvus (Cloud-Native Distributed)
- **Đặc trưng**: Thiết kế phân tán kiến trúc Microservices tách biệt hoàn toàn giữa `Compute Worker`, `Storage Broker` (S3/MinIO), và `Log Broker` (Kafka/Pulsar).
- **Điểm mạnh nhất**: Khả năng mở rộng quy mô ngang (`Horizontal Scalability`) lên tới hàng tỷ vector; hỗ trợ GPU indexing (Knowhere engine).
- **Điểm yếu**: Kiến trúc vận hành cực kỳ phức tạp, ngốn tài nguyên khi triển khai quy mô nhỏ.

#### 3. Pinecone (Fully Managed Proprietary)
- **Đặc trưng**: Dịch vụ đám mây Serverless 100%, trừu tượng hóa toàn bộ việc quản trị hạ tầng.
- **Điểm mạnh nhất**: Zero-ops, tự động co giãn (`Auto-scaling`), tính sẵn sàng cao.
- **Điểm yếu**: Mã nguồn đóng (`Vendor Lock-in`), chi phí sử dụng tăng đột biến theo dung lượng lưu trữ và số lượng đọc ghi, không thể tự triển khai On-Premise.

#### 4. Chroma (Local & Embedded)
- **Đặc trưng**: Cực kỳ thân thiện với lập trình viên Python/JS, nhúng trực tiếp vào tiến trình ứng dụng như SQLite hoặc chạy qua Docker container nhẹ.
- **Trường hợp tối ưu**: Rất thích hợp cho thử nghiệm nhanh (`Prototyping`), ứng dụng AI chạy cục bộ trên máy trạm (`Edge/Desktop AI`). Không khuyến nghị cho hệ thống phân tán chịu tải lớn.

---

### 3.2 Integrated Extension: PostgreSQL với pgvector

`pgvector` là một tiện ích mở rộng mã nguồn mở biến PostgreSQL thành một Vector Database hoàn chỉnh mà không cần rời bỏ hệ sinh thái SQL:
- Hỗ trợ kiểu dữ liệu `vector(dimensions)`, `halfvec` (16-bit float), `sparsevec` và `bit`.
- Cung cấp hai giải thuật chỉ mục cốt lõi: **HNSW** (từ pgvector 0.5.0) và **IVFFlat**.
- Hỗ trợ đầy đủ các toán tử khoảng cách: `<->` (Euclidean $L_2$), `<#>` (Negative Inner Product), `<=>` (Cosine Distance), `<+>` ($L_1$ Distance), `<~>` (Hamming Distance).

---

### 3.3 Ma Trận Đánh Đổi Kiến Trúc (Architectural Trade-Off Matrix)

```
+---------------------------------------------------------------------------------------------------------+
|                                MA TRẬN ĐÁNH GIÁ VÀ LỰA CHỌN CƠ SỞ DỮ LIỆU VECTOR                        |
+--------------------------+----------------------------------------+-------------------------------------+
| Tiêu chí Đánh giá        | PostgreSQL + pgvector                  | Standalone Vector DB (Qdrant/Milvus)|
+--------------------------+----------------------------------------+-------------------------------------+
| Tính Toàn vẹn Dữ liệu    | Hoàn hảo (ACID Transactions 100%)      | Hạn chế (Thường là Eventual Consist)|
|                          | Rollback, Foreign Keys, Triggers chuẩn | Không có quan hệ ràng buộc ngoại    |
+--------------------------+----------------------------------------+-------------------------------------+
| Tính Phức tạp Vận hành   | Cực thấp (Tận dụng Postgres sẵn có)    | Trung bình đến Rất cao (Thêm cụm CSDL|
|                          | Dùng chung backup, replica, monitoring | riêng, đồng bộ pipeline ETL)        |
+--------------------------+----------------------------------------+-------------------------------------+
| Khả năng JOIN Dữ liệu    | Tuyệt đối: JOIN 1 câu SQL giữa Vector  | Bất khả thi: Phải query Vector DB,  |
|                          | và bảng nghiệp vụ (Users, Orders,...)  | lấy danh sách IDs rồi query RDBMS   |
+--------------------------+----------------------------------------+-------------------------------------+
| Quy mô Tối ưu (Vector N) | Tối ưu từ 100K đến 10,000,000 vectors   | Vô hạn: Tối ưu từ 10M tới hàng tỷ   |
|                          | (> 20M đòi hỏi cấu hình phần cứng lớn) | nhờ kiến trúc Sharding phân tán     |
+--------------------------+----------------------------------------+-------------------------------------+
| Throughput (QPS)         | 500 - 3,000 QPS (Tùy thuộc cấu hình)   | 5,000 - 50,000+ QPS                 |
+--------------------------+----------------------------------------+-------------------------------------+
| Tài nguyên Cạnh tranh    | Index HNSW chiếm RAM chung với Postgres| Tài nguyên tính toán độc lập,       |
|                          | Shared Buffers và Work Mem             | không ảnh hưởng OLTP nghiệp vụ      |
+--------------------------+----------------------------------------+-------------------------------------+
```

> **Lời Khuyên Kiến Trúc Sư Trưởng (Architectural Verdict)**:
> 1. **Áp dụng `pgvector` ngay từ đầu (Default Choice)** cho 90% các dự án doanh nghiệp: Khi quy mô dữ liệu dưới 10 triệu vectors, cần tính toàn vẹn dữ liệu tuyệt đối, cần JOIN với metadata bảng nghiệp vụ, và muốn tối giản chi phí hạ tầng.
> 2. **Chuyển sang `Qdrant` hoặc `Milvus`** khi:
>    - Quy mô vượt quá 20 - 50 triệu vectors.
>    - Đòi hỏi thông lượng tìm kiếm cực lớn ($> 5,000 \text{ QPS}$).
>    - Nhu cầu lọc metadata cực kỳ phức tạp trên tập dữ liệu động với độ chọn lọc biến thiên liên tục.

---

## 4. TÌM KIẾM LAI & LỌC DỮ LIỆU NÂNG CAO (HYBRID SEARCH & FILTERED VECTOR SEARCH)

### 4.1 Hybrid Search: Phối Hợp Dense Semantic + Sparse Keyword (BM25)

Trong các ứng dụng thực tế (đặc biệt là Retrieval-Augmented Generation - RAG), việc chỉ dựa vào **Dense Vector Search** thuần túy thường dẫn đến các thất bại tai hại:
- **Trường hợp thất bại của Dense Vector**: Người dùng truy vấn mã hóa đơn `INV-2026-9981`, tên thuốc cụ thể `Paracetamol 500mg`, hoặc mã lỗi hệ thống `ERR_CONNECTION_REFUSED`. Dense embedding model ánh xạ chúng thành các khái niệm trừu tượng chung chung và trả về kết quả sai lệch.
- **Trường hợp thất bại của Keyword Search**: Người dùng hỏi *"Làm thế nào để khắc phục tình trạng máy tính quá nóng?"*. BM25 sẽ bỏ qua các tài liệu chứa cụm từ *"Giải pháp hạ nhiệt CPU"* hoặc *"Thay keo tản nhiệt"* vì không trùng từ khóa chính xác.

**Hybrid Search (Tìm kiếm Lai)** kết hợp sức mạnh của cả hai thế giới:
$$\text{Hybrid Search} = \text{Dense Vector Search (Hiểu Ngữ Cảnh)} + \text{Sparse BM25 Search (Chính Xác Từ Khóa)}$$

```
                               KIẾN TRÚC TRUY XUẤT TÌM KIẾM LAI (HYBRID SEARCH)
  
                                            [ Câu Truy Vấn Của Người Dùng ]
                                                           │
                                ┌──────────────────────────┴──────────────────────────┐
                                ▼                                                     ▼
                  [ Dense Embedding Model ]                              [ BM25 Lexical Analyzer ]
                     (text-embedding-3)                                     (pg_trgm / tsvector)
                                │                                                     │
                                ▼                                                     ▼
                     [ Dense Vector Search ]                                [ Sparse Keyword Search ]
                      (HNSW Cosine Metric)                                   (Full-Text / Trigram)
                                │                                                     │
                                ├────────────── Top 100 Kết quả ──────────────────────┤
                                ▼                                                     ▼
                                └──────────────────────────┬──────────────────────────┘
                                                           │
                                                           ▼
                                      [ Reciprocal Rank Fusion (RRF) Hợp Nhất ]
                                                           │
                                                           ▼ Top 30 Ứng Viên
                                             [ Cross-Encoder Reranker ]
                                                (bge-reranker-large)
                                                           │
                                                           ▼ Top 5 Kết Quả Vàng
                                          [ Gửi Ngữ Cảnh Cho LLM Tạo Câu Trả Lời ]
```

---

### 4.2 Thuật Toán Hợp Nhất Thứ Hạng: Reciprocal Rank Fusion (RRF) & Cross-Encoder Reranker

#### 4.2.1 Reciprocal Rank Fusion (RRF)
Thách thức lớn nhất khi gộp kết quả từ Dense Search và Sparse Search là: **Điểm số không đồng nhất về mặt phân phối (`Incommensurable Scores`)**. Điểm BM25 có thể dao động từ $0$ tới $+\infty$, trong khi Cosine Similarity dao động trong khoảng $[-1, 1]$. Việc cộng điểm trực tiếp ($\alpha \cdot \text{Score}_{\text{dense}} + (1-\alpha) \cdot \text{Score}_{\text{bm25}}$) đòi hỏi chuẩn hóa điểm số (`Score Normalization`) rất mong manh và dễ lệch pha.

**Reciprocal Rank Fusion (RRF)** giải quyết triệt để vấn đề này bằng cách **chỉ quan tâm tới vị trí thứ hạng (Rank)** của tài liệu trong từng danh sách kết quả, bỏ qua điểm số thô:

$$\text{RRF Score}(d) = \sum_{m \in M} \frac{1}{k + r_m(d)}$$

Trong đó:
- $M$: Tập hợp các phương pháp tìm kiếm (ví dụ $M = \{\text{Dense}, \text{Sparse}\}$).
- $r_m(d)$: Thứ hạng của tài liệu $d$ trong hệ thống $m$ ($r \in \{1, 2, 3, \dots\}$). Nếu tài liệu không xuất hiện trong Top kết quả của hệ thống $m$, coi như giá trị mẫu số là vô cùng.
- $k$: Hằng số làm mịn (`Smoothing Constant`), theo nghiên cứu kinh điển của Cormack et al. thường đặt $k = 60$. Hằng số này đảm bảo các tài liệu xếp hạng cao nhất không lấn át hoàn toàn các tài liệu xuất hiện đều đặn ở vị trí khá tốt trên cả hai bảng xếp hạng.

*Bảng ví dụ minh họa tính điểm RRF ($k = 60$)*:
```
+-------------+----------------+----------------+-------------------------------------+-------------+
| Tài Liệu    | Hạng Dense     | Hạng Sparse    | Công thức tính RRF                  | Điểm RRF    |
+-------------+----------------+----------------+-------------------------------------+-------------+
| Doc A       | 1              | 3              | 1/(60 + 1) + 1/(60 + 3) = 0.01639 + 0.01587 | 0.03226     |
| Doc B       | 2              | Không lọt Top  | 1/(60 + 2) + 0          = 0.01613           | 0.01613     |
| Doc C       | 15             | 2              | 1/(60 + 15) + 1/(60 + 2)= 0.01333 + 0.01613 | 0.02946     |
+-------------+----------------+----------------+-------------------------------------+-------------+
==> Thứ tự sau hợp nhất: Doc A (Hạng 1) -> Doc C (Hạng 2) -> Doc B (Hạng 3).
```

#### 4.2.2 Tái Xếp Hạng Hai Tầng với Cross-Encoder Reranker
- **Tầng 1 — Bi-Encoder (First-Stage Retrieval)**:
  - Vector của Document và Query được sinh ra độc lập.
  - Tốc độ cực nhanh nhờ chỉ mục HNSW ($< 5\text{ms}$).
  - Đánh đổi: Hai văn bản không nhìn thấy nhau trong quá trình tính toán embedding, bỏ lỡ tương tác từ-nối-từ chi tiết (`Token-to-Token Cross-Attention`).
- **Tầng 2 — Cross-Encoder (Second-Stage Reranking)**:
  - Ghép cặp trực tiếp chuỗi: `[CLS] Query [SEP] Document [EOS]` đưa vào mô hình Transformer.
  - Cơ chế Self-Attention tính toán sự tương quan giữa từng từ của truy vấn với từng từ của văn bản.
  - Độ chính xác vượt trội, loại bỏ hoàn toàn các tài liệu "ảo giác ngữ nghĩa".
  - Chi phí: Rất tốn kém về điện toán CPU/GPU. Do đó chỉ áp dụng để xếp hạng lại Top 20-50 tài liệu được trả về từ Tầng 1.

---

### 4.3 Các Chiến Lược Metadata Filtering: Pre-filtering, Post-filtering, Single-stage Graph Traversal

Một bài toán thực tế phổ biến: *"Tìm kiếm các văn bản về 'quy chế bảo mật' nhưng chỉ thuộc phòng ban IT (`dept = 'IT'`) và tạo trong năm 2026 (`year = 2026`)"*. Có 3 cơ chế thực thi:

```
                          CÁC CHIẾN LƯỢC LỌC METADATA (FILTERING)
  
       PRE-FILTERING                     POST-FILTERING                   SINGLE-STAGE FILTERING
  (Lọc trước -> Tìm sau)             (Tìm trước -> Lọc sau)               (Lọc ngay trong đồ thị)
  
   [Toàn bộ Database]                 [Toàn bộ Database]                   [Toàn bộ Database]
           │                                  │                                    │
           ▼                                  ▼                                    ▼
     [ Lọc Metadata ]                    [ HNSW Search ]                      [ HNSW Duyệt Đồ Thị ]
     dept='IT' & 2026                   (Lấy Top 100 láng giềng)              (Chỉ nhảy qua các nút
           │                                  │                                thỏa mãn điều kiện lọc)
           ▼ Tập ID nhỏ                       ▼                                    │
     [ Quét Vector ]                     [ Lọc Metadata ]                          ▼
   (Mất chỉ mục HNSW,                   (Dễ rỗng kết quả nếu                   [ Top-k Kết Quả ]
    phải Flat scan)                      bị loại hết!)                     [Chính xác & Duy trì HNSW]
```

#### 1. Post-Filtering (Lọc sau truy vấn)
- **Cách thức**: Chạy tìm kiếm Vector HNSW lấy $k$ kết quả gần nhất trong toàn bộ không gian dữ liệu, sau đó duyệt qua $k$ kết quả này và loại bỏ những bản ghi không thỏa mãn metadata.
- **Rủi ro chí mạng**: Nếu điều kiện lọc có độ chọn lọc cao (`High Selectivity` - ví dụ chỉ có $0.1\%$ dữ liệu thuộc phòng ban IT), toàn bộ Top $k$ vector gần nhất có thể đều thuộc phòng ban khác. Kết quả trả về cho người dùng là danh sách rỗng (`Zero Recall Catastrophe`), mặc dù trong cơ sở dữ liệu vẫn có các vector thỏa mãn điều kiện!

#### 2. Pre-Filtering (Lọc trước truy vấn)
- **Cách thức**: Sử dụng chỉ mục B-Tree truyền thống để lọc ra danh sách các `doc_id` thỏa mãn điều kiện metadata. Sau đó chỉ tìm kiếm vector trên tập `doc_id` này.
- **Rủi ro**: Nếu tập ID lọc được quá lớn (ví dụ 1 triệu bản ghi), việc tìm kiếm vector trên tập con này không thể tận dụng đồ thị HNSW toàn cục, buộc hệ thống phải quét tuần tự (`Brute-force Flat Scan`), dẫn đến suy giảm nghiêm trọng về hiệu năng độ trễ.

#### 3. Single-Stage / Iterative Filtering (Lọc Đồng Thời Trong Quá Trình Duyệt Đồ Thị)
- **Cách thức đỉnh cao (Được cài đặt trong Qdrant và pgvector 0.7+)**:
  - Khi thuật toán HNSW duyệt qua các đỉnh của đồ thị, tại mỗi bước chuyển tiếp, nó kiểm tra điều kiện metadata của nút láng giềng:
    - Nếu nút láng giềng **thỏa mãn** metadata: Thêm vào danh sách ứng viên kết quả (`Candidate Pool`).
    - Nếu nút láng giềng **không thỏa mãn**: Vẫn có thể tạm thời dùng nút đó làm "cầu nối định tuyến (`Routing Bridge`)" để đi tới các vùng đồ thị khác, nhưng tuyệt đối không đưa vào tập kết quả trả về.
  - Nhờ vậy, đồ thị không bao giờ bị đứt gãy, đảm bảo luôn tìm đủ $k$ kết quả hợp lệ với tốc độ logarithmic.

---

## 5. CẤU HÌNH PGVECTOR CHUẨN PRODUCTION & THIẾT KẾ KIẾN TRÚC THỰC CHIẾN

Dưới đây là cẩm nang cấu hình chuẩn sản xuất (`Production-Ready Script`) được kiểm chứng thực tế cho hệ thống PostgreSQL 16+ tích hợp `pgvector`.

### 5.1 Kịch Bản Khởi Tạo Bảng & Cấu Hình Bộ Nhớ pgvector Tối Ưu

```sql
-- ============================================================================
-- 1. BẬT TIỆN ÍCH MỞ RỘNG (EXTENSIONS)
-- ============================================================================
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- Hỗ trợ tìm kiếm từ khóa mờ/trigram
CREATE EXTENSION IF NOT EXISTS btree_gin; -- Tối ưu hóa index đa cột kết hợp

-- ============================================================================
-- 2. ĐIỀU CHỈNH THÔNG SỐ BỘ NHỚ CHO TIẾN TRÌNH BUILD INDEX
-- Lưu ý: Thực thi trong session hiện tại trước khi tạo index HNSW
-- ============================================================================
-- Cấp đủ bộ nhớ RAM để xây dựng đồ thị HNSW hoàn toàn trong bộ nhớ (In-memory)
SET maintenance_work_mem = '4GB';

-- Tận dụng tối đa đa nhân CPU để xây dựng đồ thị HNSW song song
SET max_parallel_maintenance_workers = 4;

-- ============================================================================
-- 3. TẠO BẢNG DỮ LIỆU TRI THỨC DOANH NGHIỆP (KNOWLEDGE CHUNKS)
-- ============================================================================
DROP TABLE IF EXISTS document_chunks CASCADE;

CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL,
    tenant_id VARCHAR(64) NOT NULL,
    chunk_index INT NOT NULL,
    content TEXT NOT NULL,
    tsv_content TSVECTOR GENERATED ALWAYS AS (to_tsvector('simple', content)) STORED,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    -- Cột vector 1536 chiều (chuẩn OpenAI text-embedding-3-small)
    embedding VECTOR(1536) NOT NULL
);

-- ============================================================================
-- 4. TẠO CÁC CHỈ MỤC B-TREE VÀ GIN CHO METADATA FILTERING
-- ============================================================================
-- Hỗ trợ Pre-filtering và Single-stage filtering theo tenant và trạng thái
CREATE INDEX idx_chunks_tenant_active ON document_chunks (tenant_id, is_active);

-- Hỗ trợ Full-Text Search qua Gin Index cho nhánh Sparse Search
CREATE INDEX idx_chunks_tsv ON document_chunks USING gin (tsv_content);

-- Hỗ trợ lọc trường metadata JSONB linh hoạt
CREATE INDEX idx_chunks_metadata ON document_chunks USING gin (metadata);
```

---

### 5.2 Xây Dựng HNSW Index & Tuning Runtime Parameters

```sql
-- ============================================================================
-- 5. XÂY DỰNG CHỈ MỤC HNSW TRÊN CỘT VECTOR
-- Sử dụng toán tử vector_cosine_ops cho Cosine Distance
-- ============================================================================
-- M = 16: Mỗi node liên kết tối đa 16 láng giềng (32 ở tầng 0)
-- ef_construction = 128: Danh sách ứng viên sâu khi build index -> Recall cao
CREATE INDEX idx_chunks_embedding_hnsw 
ON document_chunks 
USING hnsw (embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 128);

-- ============================================================================
-- 6. THIẾT LẬP THAM SỐ TRUY VẤN RUNTIME (RUNTIME TUNING)
-- ============================================================================
-- Tăng kích thước danh sách tìm kiếm ứng viên khi SELECT
-- ef_search càng lớn, Recall càng tiệm cận 100%, đánh đổi một phần latency
ALTER DATABASE postgres SET hnsw.ef_search = 100;

-- Cấp đủ work_mem để tránh sort trên ổ đĩa khi merge danh sách
ALTER DATABASE postgres SET work_mem = '64MB';
```

---

### 5.3 Triển Khai Truy Vấn Hybrid Search Tích Hợp RRF Bằng SQL Thuần

Hàm SQL dưới đây triển khai trọn vẹn thuật toán **Hybrid Search** kết hợp giữa **Dense Vector Search** (HNSW) và **Sparse Full-Text Search** (BM25 mô phỏng qua `tsvector`), chuẩn hóa điểm số bằng **Reciprocal Rank Fusion (RRF)** ngay trong nhân PostgreSQL:

```sql
CREATE OR REPLACE FUNCTION hybrid_search_rrf(
    query_text TEXT,
    query_embedding VECTOR(1536),
    match_tenant_id VARCHAR(64),
    match_count INT DEFAULT 10,
    rrf_k INT DEFAULT 60
)
RETURNS TABLE (
    id UUID,
    document_id UUID,
    content TEXT,
    metadata JSONB,
    dense_rank BIGINT,
    sparse_rank BIGINT,
    final_rrf_score FLOAT
)
LANGUAGE sql
STABLE
AS $$
WITH 
-- 1. Nhánh Dense Vector Search: Lấy Top 50 ứng viên gần nhất theo Cosine Distance
dense_candidates AS (
    SELECT 
        dc.id,
        ROW_NUMBER() OVER (ORDER BY dc.embedding <=> query_embedding) AS rank
    FROM document_chunks dc
    WHERE dc.tenant_id = match_tenant_id 
      AND dc.is_active = TRUE
    ORDER BY dc.embedding <=> query_embedding
    LIMIT 50
),

-- 2. Nhánh Sparse Full-Text Search: Lấy Top 50 ứng viên theo độ khớp từ khóa
sparse_candidates AS (
    SELECT 
        dc.id,
        ROW_NUMBER() OVER (
            ORDER BY ts_rank_cd(dc.tsv_content, plainto_tsquery('simple', query_text)) DESC
        ) AS rank
    FROM document_chunks dc
    WHERE dc.tenant_id = match_tenant_id 
      AND dc.is_active = TRUE
      AND dc.tsv_content @@ plainto_tsquery('simple', query_text)
    ORDER BY ts_rank_cd(dc.tsv_content, plainto_tsquery('simple', query_text)) DESC
    LIMIT 50
),

-- 3. Hợp nhất danh sách và tính điểm Reciprocal Rank Fusion (RRF)
merged_scores AS (
    SELECT 
        COALESCE(d.id, s.id) AS chunk_id,
        d.rank AS dense_rank,
        s.rank AS sparse_rank,
        -- Công thức RRF: 1/(k + rank_dense) + 1/(k + rank_sparse)
        COALESCE(1.0 / (rrf_k + d.rank), 0.0) + 
        COALESCE(1.0 / (rrf_k + s.rank), 0.0) AS rrf_score
    FROM dense_candidates d
    FULL OUTER JOIN sparse_candidates s ON d.id = s.id
)

-- 4. Trả về kết quả Top-K đã được xếp hạng tối ưu
SELECT 
    c.id,
    c.document_id,
    c.content,
    c.metadata,
    m.dense_rank,
    m.sparse_rank,
    m.rrf_score::FLOAT AS final_rrf_score
FROM merged_scores m
JOIN document_chunks c ON c.id = m.chunk_id
ORDER BY m.rrf_score DESC
LIMIT match_count;
$$;
```

---

### 5.4 Tổng Kết & Cẩm Nang Ra Quyết Định Kiến Trúc (Architecture Decision Playbook)

```
                            SƠ ĐỒ RA QUYẾT ĐỊNH VECTOR DATABASE
  
                     [ Bắt đầu dự án AI / RAG / Search ]
                                     │
                                     ▼
                      Hệ thống hiện tại đã dùng PostgreSQL?
                                ┌────┴────┐
                                ▼ CÓ      ▼ KHÔNG
                    Quy mô dữ liệu dự kiến?    Ưu tiên phát triển nhanh?
                      ┌─────────┴─────────┐         ┌───────┴───────┐
                      ▼                   ▼         ▼ CÓ            ▼ KHÔNG
                 < 10M Vectors       > 50M Vectors  Chroma / Qdrant  Milvus / Qdrant
                      │                   │         (Embedded/Docker) (Phân tán cao)
                      ▼                   ▼
                 [ pgvector ]       [ Qdrant/Milvus ]
             (Tối ưu chi phí,       (Chuyên dụng,
              100% ACID, JOIN)       Siêu tốc độ)
```

#### Quy Tắc Vàng Khi Vận Hành Hệ Thống Vector Production:
1. **Luôn chuẩn hóa Vector đơn vị trước khi lưu trữ (`Pre-normalize to Unit Length`)**: Giúp chuyển đổi bài toán tính toán Cosine Distance phức tạp thành phép nhân vô hướng Dot Product ($IP$) siêu nhanh trên phần cứng SIMD.
2. **Khởi tạo HNSW Index sau khi nạp dữ liệu số lượng lớn (`Bulk Load First, Index Later`)**: Nếu nạp hàng triệu vector vào một bảng đã có sẵn HNSW index, thời gian nạp sẽ bị nghẽn nghiêm trọng vì đồ thị liên tục bị cập nhật cấu trúc. Hãy nạp toàn bộ dữ liệu trước, tăng `maintenance_work_mem`, sau đó mới chạy lệnh `CREATE INDEX`.
3. **Tuyệt đối không bỏ qua Sparse Search trong các bài toán RAG Doanh nghiệp**: Người dùng luôn có thói quen tìm kiếm các thuật ngữ đặc thù, mã SKU, tên khách hàng. Hybrid Search kết hợp RRF là chiếc khiên vững chắc nhất chống lại hiện tượng ảo giác truy xuất ngữ nghĩa.
4. **Giám sát tỷ lệ trúng bộ nhớ (`Buffer Cache Hit Ratio`) của HNSW Index**: Đồ thị HNSW chỉ đạt độ trễ $< 5\text{ms}$ khi toàn bộ index nằm trọn vẹn trong RAM. Nếu kích thước index vượt quá RAM khả dụng dẫn đến hiện tượng tráo trang ổ đĩa (`Disk Swapping`), độ trễ tìm kiếm sẽ tăng vọt lên hàng trăm lần.

---
*Tài liệu thuộc Bản quyền Kiến trúc Hệ thống Antigravity — Pod 7 Vector Database Specialist.*
