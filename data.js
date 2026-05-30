// ============================================================
// PORTFOLIO DATA - Extracted for modularity
// ============================================================

const PROFILE = {
    name:'Neeraj Ganesh Parekh', prn:'202401070163', inst:'MIT Academy of Engineering, SPPU',
    dept:'Electronics & Telecommunication Engineering', year:'2nd Year (SY++)',
    loc:'Pune, Maharashtra, India', email1:'202401070163@mitaoe.ac.in', email2:'neerajparekh118@gmail.com',
    phone:'+91 89993 87047', linkedin:'linkedin.com/in/neeraj-parekh-np', github:'github.com/Neeraj-Parekh',
    tagline:'Embedded Systems Engineer · Industrial IoT · Edge AI · Real-Time Systems',
    domain:'Industry 4.0, Smart Manufacturing, Sensor Networks, Edge-to-Cloud Pipelines, Predictive Maintenance',
    mission:`I build end-to-end embedded systems that bridge physical sensors to cloud analytics — with a focus on industrial safety, real-time monitoring, and autonomous optimization. My work spans ESP32 firmware, cloud-connected telemetry, supervised forecasting, policy-based control, and analog circuit design for failsafe hardware. I ship solo, I learn fast, and I understand that MSME factories need lean, reliable solutions — not over-engineered enterprise bloat.`,
    whyCopper:`CopperCloud's mission to bring Industry 4.0 to MSMEs resonates with how I approach engineering: lean, reliable, and built for real factory floors — not demo videos. I value systems that improve throughput, reduce latency, and stay usable for small teams without heavy operational overhead. My Wi-Fi optimiser project focuses on live telemetry, congestion forecasting, and safe control decisions. My gas detection system triggers a hardware failsafe even when the cloud is down. I believe the best industrial IoT is invisible — it just works, keeps workers safe, and doesn't require a PhD to operate. I want to learn how to scale this mindset from prototype to production.`
};

const ALIGNMENT = [
    {need:'Smart Shopfloors — sensor data acquisition',cap:'ESP32 + sensor interfacing (I2C, SPI, UART, analog)',ev:'SIS Gas Detection, ESP32 Network Monitor'},
    {need:'Control — actuator control, PLC integration',cap:'Analog perceptron circuits, MOSFET output stages, FreeRTOS task scheduling',ev:'SIS hardware failsafe, dual-core ESP32'},
    {need:'Automate — workflow automation, triggers',cap:'AWS Lambda + SNS alerting, MQTT pub/sub, automated pipelines',ev:'SIS cloud pipeline, SAR batch processing'},
    {need:'Edge AI — onboard inference, anomaly detection',cap:'Other portfolio projects: edge inference, drift detection, and model adaptation',ev:'Edge CL system and related work'},
    {need:'Digital Twin — 3D virtual representation',cap:'Real-time dashboard development (Streamlit, React), sensor visualization',ev:'Hackathon dashboard, Sanyog dashboard'},
    {need:'IIoT Training — workforce upskilling',cap:'Self-taught across embedded, cloud, ML; can document and teach',ev:'GitHub repos with READMEs'},
    {need:'Lean deployment — right tools, not bloat',cap:'₹25K hackathon build vs ₹5L enterprise cost; solo shipping',ev:'Hackathon cost metrics'}
];

const TECHS = [
    {cat:'Embedded Core',items:['ESP32 / ESP-IDF','FreeRTOS / Dual-core','Arduino / PlatformIO','Raspberry Pi 4'],status:['✅','✅','✅','✅']},
    {cat:'Communication',items:['MQTT (paho-mqtt)','HTTP / REST','WebSocket','UART / I2C / SPI'],status:['✅','✅','✅','✅']},
    {cat:'Cloud',items:['AWS IoT Core','AWS Lambda','AWS SNS','Docker / Compose'],status:['✅','✅','✅','✅']},
    {cat:'Backend',items:['Python / FastAPI','Python / Flask','Node.js / Express','SQLite / SQL'],status:['✅','✅','✅','✅']},
    {cat:'Continual Learning',items:['Online EWC (Fisher)','GEM / A-GEM','LoRA Adapters','Mixture of Experts','Dual Model Manager','Latent Replay Buffer'],status:['✅','✅','✅','✅','✅','✅']},
    {cat:'Drift & Uncertainty',items:['Page-Hinkley Test','KS Feature Drift','MC Dropout','Temperature Scaling','Ensemble Uncertainty','ECE Calibration'],status:['✅','✅','✅','✅','✅','✅']},
    {cat:'Edge Deployment',items:['Dynamic Quantization','TorchScript Export','ONNX Export','TensorRT Optimization','Raspberry Pi Runtime'],status:['✅','✅','✅','✅','✅']},
    {cat:'ML/AI',items:['PyTorch','TensorFlow / Keras','TFLite (planned)','LSTM / GRU','BLSTM','DQN / DDPG (RL)','Genetic Algorithms','Scikit-learn','LightGBM / XGBoost'],status:['✅','✅','🟡','✅','✅','🟡','✅','✅','✅']},
    {cat:'Vision',items:['OpenCV','MediaPipe','RTMPose / MMPOSE'],status:['✅','✅','✅']},
    {cat:'Data',items:['NumPy / Pandas','GDAL / Rasterio','SNAP GPT'],status:['✅','✅','✅']},
    {cat:'MLOps',items:['MLflow Tracking','Qdrant Knowledge Base','Experiment Runner','DVC','GitHub Actions CI'],status:['✅','✅','✅','✅','✅']},
    {cat:'Electronics',items:['Op-Amps (LM-358, TL082)','MOSFETs (IRF9540)','Analog signal conditioning'],status:['✅','✅','✅']}
];

const LEARNING = [
    {tech:'Rust',status:'🟡 Learning',ctx:'Personal roadmap / Nyx prototype'},
    {tech:'QUIC',status:'🟡 Planned',ctx:'Personal roadmap / Nyx transport idea'},
    {tech:'PLC / Ladder Logic',status:'🟡 Conceptual',ctx:'Training and prep for industrial work'},
    {tech:'SCADA',status:'🟡 Theoretical',ctx:'Reading and research only'},
    {tech:'Modbus / OPC-UA',status:'🟡 Aware',ctx:'Industrial protocols under study'},
    {tech:'InfluxDB / Grafana',status:'🟡 Explored',ctx:'Time-series tooling under study'},
    {tech:'Kubernetes',status:'🔴 Not started',ctx:'Beyond current scope'}
];

const SKILL_GAPS = [
    {gap:'PLC/SCADA integration',plan:'Hands-on with client deployments; ladder logic practice'},
    {gap:'Fleet management (1000+ nodes)',plan:'OTA updates, device provisioning, certificate rotation'},
    {gap:'Industrial protocol stacks',plan:'Protocol analysis on real shopfloor networks (Modbus, OPC-UA)'},
    {gap:'Time-series databases',plan:'Migrating from CSV/JSON to InfluxDB, TimescaleDB'},
    {gap:'Predictive maintenance models',plan:'Vibration analysis, thermal imaging, anomaly detection on real machine data'},
    {gap:'Security hardening for IIoT',plan:'Certificate-based auth, network segmentation, secure boot'}
];

const DEMOS = [
    {name:'ESP32 Gas Detection Boot',hw:'ESP32 + MQ-6 + laptop',time:'2 min',shows:'Sensor → analog threshold → MQTT publish → AWS IoT Core → Lambda → SNS'},
    {name:'Edge CL System',hw:'Laptop + RTX A5000',time:'2 min',shows:'MoE routing, drift detection trigger, quantized Pi inference, FastAPI endpoint'},
    {name:'Network Monitor Packet Capture',hw:'ESP32 + laptop',time:'1 min',shows:'Dual-core FreeRTOS, scapy backend, real-time display'},
    {name:'Sanyog Skeleton Viz',hw:'Laptop + phone video',time:'30 sec',shows:'133-landmark extraction, OpenPose rendering'},
    {name:'SAR Pipeline Output',hw:'Laptop',time:'30 sec',shows:'GeoTIFF visualization, water mask overlay'}
];

const TIMELINE = [
    {date:'May 2026',event:'MITeam Selection',org:'MIT AOE × CopperCloud IOTech',detail:'Selected for industry mentorship under Director Abhijeet Deogirikar. 15 students shortlisted from ENTC.'},
    {date:'May 2026',event:'Winner — AI in Action Hackathon',org:'MIT Academy of Engineering',detail:'ESP32-based Wi-Fi optimiser using live telemetry, congestion forecasting, policy control, and safe fallback rules.'},
    {date:'2025–2026',event:'Co-Author — SAR Water Detection Paper',org:'MIT AOE × Evolving Earth (Elsevier)',detail:'Manuscript EVE-D-26-00034. 6-channel U-Net, zero-shot transfer, 468 chips, 9 geomorphological types.'},
    {date:'2025',event:'2nd Place — Zerve AI Datathon',org:'National Competition',detail:'Health insurance claim prediction. LightGBM/XGBoost/CatBoost ensemble. Gini 0.2856.'},
    {date:'2025',event:'IIT-SVAMITVA Hackathon',org:'IIT × Government of India',detail:'Drone imagery segmentation for rural property mapping. 89.9% mIoU, 87ms CPU inference.'},
    {date:'2024–Present',event:'Independent Projects',org:'Self-directed',detail:'10+ verified projects across embedded, cloud, ML, and vision. Solo shipping.'}
];

const MATH_THEMES = [
    {theme:'Knowledge Distillation',formula:'L<sub>KD</sub> = α · KL(σ(z<sub>s</sub>/T) ‖ σ(z<sub>t</sub>/T))',desc:'Soft-target distillation with temperature scaling for task-incremental learning'},
    {theme:'EWC Penalty',formula:'L<sub>EWC</sub> = λ/2 · Σ F<sub>i</sub>(θ<sub>i</sub> − θ*<sub>i</sub>)²',desc:'Diagonal Fisher information weighted quadratic penalty preventing catastrophic forgetting'},
    {theme:'LoRA Factorization',formula:"W' = W + BA,  rank r ≪ min(d,k)",desc:'Low-rank adapter injection with α/r scaling for parameter-efficient task adaptation'},
    {theme:'BWT (Backward Transfer)',formula:'BWT = 1/T−1 · Σ(R<sub>T,i</sub> − R<sub>i,i</sub>)',desc:'Measures performance change on earlier tasks after learning new ones — negative means forgetting'},
    {theme:'Reservoir Sampling',formula:'P(replace at j) = m/j',desc:'Uniform streaming sample guarantee for bounded replay buffers'},
    {theme:'Page-Hinkley Test',formula:'m<sub>t</sub> = Σ(x<sub>i</sub> − x̄<sub>i</sub> − δ), detect when m<sub>t</sub> − min(m) > λ',desc:'Sequential change detection for concept drift in streaming data'},
    {theme:'MC Dropout Uncertainty',formula:"H[y|x] = −Σ p(y|x) log p(y|x), via T stochastic passes",desc:'Predictive entropy with epistemic/aleatoric decomposition via dropout at inference'},
    {theme:'GEM Gradient Projection',formula:'g′ = g − G<sub>m</sub>(G<sub>m</sub>ᵀG<sub>m</sub>)⁻¹G<sub>m</sub>ᵀg',desc:'Quadratic programming projection to prevent gradient interference with past tasks'}
];

const TOOLTIPS = {
    'FreeRTOS':'Real-time operating system kernel for embedded devices.',
    'xTaskCreatePinnedToCore':'Creates a task pinned to a specific CPU core on ESP32.',
    'analogRead':'Reads the value from an analog pin on the MCU.',
    'mqtt_client':'MQTT client instance for pub/sub messaging.',
    'nn.Sequential':'PyTorch container for chaining neural network layers.',
    'torch.argmax':'Returns the index of the maximum value in a tensor.',
    'OnlineEWC':'Online Elastic Weight Consolidation with EMA Fisher updates.',
    'Fisher':'Diagonal Fisher information matrix — measures parameter importance.',
    'LoRALayer':'Low-rank adapter injecting W + α/r·BA into frozen base weights.',
    'PageHinkley':'Sequential change detection test for concept drift monitoring.',
    'KSFeatureDriftDetector':'Kolmogorov-Smirnov two-sample test on feature distributions.',
    'DriftMonitor':'Combined drift detection orchestrating PH + KS detectors.',
    'DualModelManager':'Stable/plastic model pair with BWT-driven promotion logic.',
    'MixtureOfExperts':'Gating network routing inputs to specialized expert sub-models.',
    'FedAvg':'Federated averaging — weighted parameter aggregation across clients.',
    'reservoir_sample':'Uniform sampling guarantee for bounded streaming buffers.',
};

const DEFINITIONS = {
    'LoRA': `
        <strong>LoRA (Low-Rank Adapters)</strong>: a parameter-efficient fine-tuning method that injects low-rank adapter matrices B and A into pretrained weight updates so W' = W + BA. Only adapter parameters are trained (rank r ≪ full weight), keeping most pre-trained weights frozen. Example: adapt a ResNet classifier to a new class set by training LoRA adapters of rank r=8 instead of full-finetuning.
        <div style="margin-top:6px;font-size:12px;color:#6b7280">Key refs: Hu et al., 2021 — LoRA (arXiv:2106.09685). Practical tip: use α/r scaling and initialize B with small variance.</div>
    `,
    'PEFT': `
        <strong>PEFT (Parameter-Efficient Fine-Tuning)</strong>: umbrella term for methods (LoRA, adapters, IA3, prompt tuning) that add or reparameterize a small set of parameters for new tasks instead of updating the full model. PEFT reduces memory, speeds up checkpointing, and simplifies multi-task deployment.
        <div style="margin-top:6px;font-size:12px;color:#6b7280">Example: in few-shot classification, PEFT adapters allow switching task adapters at runtime without storing full model copies. See: Lester et al., 2021 (Prompt Tuning); Hu et al., 2021 (LoRA).</div>
    `,
    'FLOP': `
        <strong>FLOP (Floating-point Operation)</strong>: a single floating-point operation (add/multiply). Used to quantify compute cost (GFLOPs, TFLOPs). When measuring inference cost, count multiply-accumulate operations per token/image and include gating overhead for MoE.
        <div style="margin-top:6px;font-size:12px;color:#6b7280">Practical: MoE with top-k routing reduces effective FLOPs per sample compared to dense ensembles.</div>
    `,
    'EWC': `
        <strong>EWC (Elastic Weight Consolidation)</strong>: regularization that penalizes changes to parameters deemed important for previous tasks using a Fisher information estimate. Loss term: λ/2 Σ F_i (θ_i − θ*_i)^2. Works best when task boundaries are known or when Fisher is updated online with EMA.
        <div style="margin-top:6px;font-size:12px;color:#6b7280">Key refs: Kirkpatrick et al., 2017 (EWC). Practical tip: compute diagonal Fisher on a small held-out set and mask out low-importance parameters to allow plastic adaptation.</div>
    `,
    'MoE': `
        <strong>MoE (Mixture of Experts)</strong>: model composition with several expert subnetworks and a gating network that routes each input to a subset of experts (top-k). MoE increases capacity while keeping per-step compute low when k ≪ #experts.
        <div style="margin-top:6px;font-size:12px;color:#6b7280">Key refs: Shazeer et al., 2017; recent efficient MoE routing practices (top-k, load balancing). Example: 16 experts with top-2 routing yields 2× compute per-sample but 16× representational capacity.</div>
    `,
    'Drift': `
        <strong>Drift</strong>: change in data distribution over time. Two common types: feature drift (P(x) shifts) and concept drift (P(y|x) changes). Detect using Page-Hinkley (loss stream) and Kolmogorov-Smirnov (feature windows). On detection, trigger replay, adapter creation, or selective fine-tuning.
        <div style="margin-top:6px;font-size:12px;color:#6b7280">Practical: maintain warmup windows and combine detectors (loss + feature) to reduce false positives. See: Page & Hinkley, sequential change detection; Bifet et al., drift survey.</div>
    `,
    'Replay': `
        <strong>Replay Buffer</strong>: bounded memory storing past examples for rehearsal. Sampling strategies: uniform reservoir sampling (provable), loss-prioritized replacement, or class-balanced reservoirs to avoid class imbalance during rehearsal.
        <div style="margin-top:6px;font-size:12px;color:#6b7280">Implementation note: store embeddings + metadata, not always full images, to reduce memory on edge devices.</div>
    `,
    'GEM': `
        <strong>GEM / A-GEM</strong>: (A-)Gradient Episodic Memory constrains gradient updates so they do not increase loss on a small memory of past examples. A-GEM is an efficient approximation using average gradients to compute a projection direction.
        <div style="margin-top:6px;font-size:12px;color:#6b7280">Key refs: Lopez-Paz & Ranzato, 2017 (GEM). Use A-GEM for lightweight edge-friendly projection operations.</div>
    `,
    'BWT': `
        <strong>Backward Transfer (BWT)</strong>: metric measuring how learning new tasks affects performance on earlier tasks. Negative BWT indicates forgetting; positive BWT indicates beneficial transfer (improvement on old tasks after new learning).
    `,
    'KS Test': `
        <strong>KS Test (Kolmogorov-Smirnov)</strong>: a two-sample non-parametric test comparing feature distributions to detect feature drift. Useful for high-level checks when features are continuous.
        <div style="margin-top:6px;font-size:12px;color:#6b7280">Practical: compare current feature window to reference window; flag if p &lt; 0.05. See: Massey, 1951.</div>
    `,
    'Page-Hinkley': `
        <strong>Page-Hinkley Test</strong>: sequential change detection on a scalar stream (e.g., loss). Tracks cumulative deviations from running mean and signals when a threshold is exceeded.
        <div style="margin-top:6px;font-size:12px;color:#6b7280">Useful for quick loss-based drift signals; tune warmup and threshold to control sensitivity.</div>
    `,
    'MC Dropout': `
        <strong>MC Dropout</strong>: use dropout at inference T times to approximate Bayesian model uncertainty; aggregate predictive entropy across samples to estimate uncertainty.
        <div style="margin-top:6px;font-size:12px;color:#6b7280">Practical: T=10–30 stochastic forward passes; compute predictive entropy for abstention thresholds.</div>
    `,
    'Temperature Scaling': `
        <strong>Temperature Scaling</strong>: post-hoc calibration method that rescales logits by temperature T to improve softmax calibration (ECE reduction).
        <div style="margin-top:6px;font-size:12px;color:#6b7280">Simple to implement: optimize T on a validation set to minimize NLL.</div>
    `,
    'ECE': `
        <strong>Expected Calibration Error (ECE)</strong>: measures calibration by binning predicted probabilities and comparing accuracy vs confidence in each bin.
    `,
    'Entropy': `
        <strong>Entropy</strong>: predictive entropy H[y|x] = -Σ p(y|x) log p(y|x). Used as an uncertainty signal for selective prediction or abstention.
    `,
    'KD': `
        <strong>Knowledge Distillation (KD)</strong>: train a student model to match a teacher's softened outputs using KL divergence with temperature scaling; useful for transferring knowledge across tasks or compressing models.
    `,
    'Quantization': `
        <strong>Quantization</strong>: reduce model numeric precision (e.g., INT8) to shrink size and speed up inference; can be dynamic or static (with calibration).
    `,
    'TorchScript': `
        <strong>TorchScript</strong>: PyTorch serialization format (script/trace) that enables running models without the Python interpreter, easing edge deployment.
    `,
    'ONNX': `
        <strong>ONNX</strong>: open model format for interoperability between frameworks; export PyTorch to ONNX for cross-platform runtimes.
    `,
    'TensorRT': `
        <strong>TensorRT</strong>: NVIDIA runtime for highly-optimized inference, especially on GPUs — supports kernel fusion and mixed precision.
    `,
    'Raspberry Pi': `
        <strong>Raspberry Pi</strong>: ARM-based single-board computer targeted for edge deployments; may require CPU-optimized runtime and model quantization for acceptable latency.
    `,
    'FastAPI': `
        <strong>FastAPI</strong>: modern Python web framework for building fast API endpoints (async support), suitable for lightweight model inference services.
    `,
    'Edge Deployment': `
        <strong>Edge Deployment</strong>: set of practical steps (quantize, export, runtime) to run ML models on edge devices with latency/size constraints.
    `,
    'PyTorch': `
        <strong>PyTorch</strong>: deep learning library used across the project; supports eager mode, TorchScript, and export to ONNX.
    `,
    'Online EWC': `
        <strong>Online EWC</strong>: EWC variant that updates Fisher estimates incrementally (e.g., via EMA) for streaming/online settings.
    `,
    'A-GEM': `
        <strong>A-GEM</strong>: a computationally cheaper approximation of GEM that uses average gradients from episodic memories to constrain updates.
    `,
    'Dual Model': `
        <strong>Dual Model Manager</strong>: pattern that keeps a stable model and a plastic model; promotes the plastic model to stable after validation to control BWT and forgetting.
    `,
    'Replay Buffer': `
        <strong>Replay Buffer</strong>: (alias) bounded memory storing past examples for rehearsal; prefer reservoir sampling for unbiased retention.
    `
};

const TERM_WALKS = {
    'LoRA': [
        {step:'Why use LoRA?',note:'Reduces trainable parameter count by orders of magnitude; quick to checkpoint per-task adapters.'},
        {step:'Where to apply',note:'Adapter injection points: attention projection, MLP layers, or classifier heads — pick layers where task-specific features appear.'},
        {step:'Hyperparams',note:'Rank r, α (scaling), and dropout on adapters. Start with r=4–16 for vision tasks.'},
        {step:'Persist & Switch',note:'Save adapter state_dict only; switch adapters at inference without reloading base weights.'}
    ],
    'PEFT': [
        {step:'Method family',note:'Includes LoRA, adapters, IA3, prompt tuning — choose based on memory and latency constraints.'},
        {step:'Trade-offs',note:'Prompt tuning: minimal params but limited transfer; LoRA: explicit adapters, good accuracy vs cost.'}
    ],
    'EWC': [
        {step:'Fisher estimate',note:'Estimate diagonal Fisher from log-likelihood gradients on a reference buffer.'},
        {step:'Applying penalty',note:'Add λ/2 Σ F_i (θ_i − θ*_i)^2 to loss; tune λ via validation to balance plasticity/stability.'}
    ],
    'MoE': [
        {step:'Gating design',note:'Use soft gating for smooth gradients or top-k sparse gating for inference cost reduction.'},
        {step:'Load balance',note:'Apply auxiliary loss to avoid expert collapse (e.g., importance loss).'},
        {step:'Expert freezing',note:'Freeze lower layers and fine-tune expert heads with LoRA adapters for per-task specialization.'}
    ],
    'Drift': [
        {step:'Detection',note:'Combine Page-Hinkley on loss + KS test on features to reduce false positives.'},
        {step:'Reaction',note:'On drift: trigger replay, create adapters, or escalate human-in-the-loop checks.'}
    ]
};

const KEYWORDS = ['def','class','return','if','else','import','from','as','void','setup','loop','while','int','const','auto','struct','impl','fn','let','pub','use','mod','self','super','with'];

function safeJSONParse(value, fallback, storageKey = null) {
    if (!value) return fallback;
    try {
        return JSON.parse(value);
    } catch (err) {
        if (storageKey) {
            try {
                localStorage.removeItem(storageKey);
            } catch (removeErr) {
                // Ignore storage removal failures.
            }
        }
        return fallback;
    }
}

// ============================================================
// PROJECTS DATA — with internal ratings meta
// ============================================================

const PROJECTS = [
    {
        id:'edge-cl', title:'Edge Continual Learning System', status:'✅ Completed', relevance:'⭐⭐⭐⭐⭐',
        statusLabel:'Hackathon Winner — Full CL Pipeline with Edge Deployment & MLOps',
        tagline:'Online continual learning with MoE routing, drift detection, LoRA adapters, and Raspberry Pi inference — 4-layer production architecture.',
            images: [],
            galleryMode: 'carousel',
        layers:[
            {
                name:'CL Training', icon:'cpu',
                desc:'Continual-learning methods: Online EWC with diagonal Fisher, GEM/A-GEM gradient projection, LoRA low-rank adapters, Mixture of Experts with soft/hard/top-k gating, dual stable/plastic model management, and latent replay buffer with reservoir sampling.',
                arch:[
                    {step:'Online EWC',desc:'EMA Fisher + diagonal penalty for forgetting prevention'},
                    {step:'LoRA Adapters',desc:'W\' = W + α/r·BA, task-specific low-rank injection'},
                    {step:'MoE Routing',desc:'Soft/hard/top-k gating → expert mixture via einsum'},
                    {step:'Dual Model Mgr',desc:'Stable/plastic pair, BWT-driven promotion'},
                    {step:'Replay Buffer',desc:'Reservoir sampling, loss-prioritized, class-balanced'}
                ],
                metrics:[
                    {label:'MoE LoRA Rank',val:'Configurable (4–64)'},
                    {label:'Replay Strategy',val:'Reservoir + loss-priority'},
                    {label:'BWT Metric',val:'Computed per task transition'},
                    {label:'KD Temperature',val:'Configurable (default T=4)'},
                    {label:'Expert Freezing',val:'Per-task with LoRA adapter save/load'},
                    {label:'EWC Lambda',val:'Adaptive with selective Fisher masking'}
                ],
                tags:['PyTorch','Online EWC','GEM','A-GEM','LoRA','MoE','Dual Model','Replay Buffer','KD','BWT'],
                code:`# Mixture of Experts — Gating & Expert Routing
class MixtureOfExperts(nn.Module):
    def __init__(self, config: MoEConfig):
        super().__init__()
        self.backbone = ResNetBackbone(config)
        self.gating = GatingNetwork(
            config.feature_dim, config.num_experts
        )
        self.experts = nn.ModuleList([
            Expert(config) for _ in range(config.num_experts)
        ])
        self.lora_layers = nn.ModuleDict()

    def forward(self, x, task_id=None):
        features = self.backbone(x)
        gate_weights = self.gating(features)
        expert_outputs = torch.stack(
            [e(features) for e in self.experts], dim=-1
        )
        # Weighted mixture via einsum
        mixed = torch.einsum(
            'be,edo->bdo', gate_weights, expert_outputs
        )
        return mixed, gate_weights`,
                walk:[
                    {lines:[1,4],note:'Define MoE architecture inheriting from PyTorch Module, initialized with a config dataclass for reproducibility.'},
                    {lines:[5,7],note:'Instantiate ResNet backbone for feature extraction — shared across all experts for parameter efficiency.'},
                    {lines:[8,10],note:'Create gating network: a learned linear mapping from feature space to expert selection weights.'},
                    {lines:[11,13],note:'Build a ModuleList of expert heads, each with its own LoRA adapter and task-specific parameters.'},
                    {lines:[16,19],note:'Forward all expert heads over shared features, stacking outputs along the expert dimension for batched mixture computation.'},
                    {lines:[20,23],note:'Compute weighted expert mixture via Einstein summation — gate_weights (batch × experts) times expert_outputs (batch × output × experts) yields the final routed prediction.'}
                ]
            },
            {
                name:'Drift & Uncertainty', icon:'shield',
                desc:'Dual-drift detection using Page-Hinkley test on loss streams and Kolmogorov-Smirnov two-sample test on feature distributions. Uncertainty quantification via MC Dropout, temperature scaling, ensemble disagreement, and Expected Calibration Error (ECE) for selective prediction.',
                arch:[
                    {step:'Page-Hinkley',desc:'Sequential loss drift detection with cumulative sum test'},
                    {step:'KS Feature Drift',desc:'Feature distribution shift via two-sample test'},
                    {step:'Drift Monitor',desc:'Combined orchestrator, drift event aggregation'},
                    {step:'MC Dropout',desc:'T stochastic passes → predictive entropy'},
                    {step:'ECE Calibration',desc:'Expected calibration error + temperature scaling'}
                ],
                metrics:[
                    {label:'PH Warmup',val:'Configurable window'},
                    {label:'KS Significance',val:'Configurable α level'},
                    {label:'MC Samples',val:'T=10–30 forward passes'},
                    {label:'ECE Bins',val:'15-bin calibration'},
                    {label:'Abstention',val:'Entropy-threshold selective prediction'}
                ],
                tags:['Page-Hinkley','KS Test','MC Dropout','Temperature Scaling','ECE','Entropy','Drift Detection'],
                code:`# Drift Detection — Page-Hinkley + KS Monitor
class DriftMonitor:
    def __init__(self, ph_threshold=5.0, ks_alpha=0.05):
        self.ph_detector = PageHinkleyDetector(
            min_instances=30, delta=0.005,
            threshold=ph_threshold
        )
        self.ks_detector = KSFeatureDriftDetector(
            alpha=ks_alpha, window_size=500
        )
        self.drift_events = []

    def update(self, loss, features, task_id):
        loss_drift = self.ph_detector.update(loss)
        feat_drift = self.ks_detector.update(features)
        is_drift = loss_drift or feat_drift
        if is_drift:
            self.drift_events.append({
                'task': task_id,
                'loss_drift': loss_drift,
                'feat_drift': feat_drift
            })
        return is_drift`,
                walk:[
                    {lines:[1,3],note:'Initialize the combined drift monitor with configurable Page-Hinkley threshold and KS significance level.'},
                    {lines:[4,7],note:'Instantiate Page-Hinkley sequential change detector — monitors cumulative deviation of loss from running mean.'},
                    {lines:[8,11],note:'Instantiate KS feature drift detector — compares current feature window against reference using two-sample Kolmogorov-Smirnov test.'},
                    {lines:[14,16],note:'Feed the current loss scalar and feature vector to respective detectors, obtaining boolean drift signals.'},
                    {lines:[17,23],note:'If either detector fires, record a structured drift event with task context and trigger type. Return combined drift flag for downstream adaptation logic.'}
                ]
            },
            {
                name:'Edge Deployment', icon:'zap',
                desc:'Full edge deployment pipeline: dynamic quantization (INT8), TorchScript export, ONNX export, TensorRT optimization with calibration, and Raspberry Pi inference runtime. Benchmarked for latency, throughput, and model size across all formats.',
                arch:[
                    {step:'Trained Model',desc:'PyTorch model from CL pipeline'},
                    {step:'Quantization',desc:'Dynamic INT8 + static with calibration'},
                    {step:'TorchScript',desc:'Traced/scripted graph export'},
                    {step:'ONNX Export',desc:'Cross-framework standard format'},
                    {step:'TensorRT',desc:'GPU-optimized engine with fallback'},
                    {step:'Pi Runtime',desc:'Raspberry Pi inference with camera/benchmark modes'}
                ],
                metrics:[
                    {label:'Quantization',val:'Dynamic + static INT8'},
                    {label:'TorchScript',val:'Traced graph export verified'},
                    {label:'ONNX',val:'Cross-platform export'},
                    {label:'TensorRT',val:'With TorchScript fallback'},
                    {label:'Pi Target',val:'<100ms per inference on Pi 4'}
                ],
                tags:['Quantization','TorchScript','ONNX','TensorRT','Raspberry Pi','FastAPI','Edge Deployment'],
                code:`# Edge Deployment — Quantize, Export, Benchmark
class ModelQuantizer:
    def quantize_dynamic(self, model):
        return torch.quantization.quantize_dynamic(
            model, {nn.Linear, nn.Conv2d},
            dtype=torch.qint8
        )

    def export_torchscript(self, model, sample_input):
        scripted = torch.jit.trace(model, sample_input)
        return scripted

    def benchmark(self, model, sample_input, n=100):
        times = []
        with torch.no_grad():
            for _ in range(n):
                start = time.perf_counter()
                model(sample_input)
                times.append(time.perf_counter() - start)
        return {
            'mean_ms': np.mean(times) * 1000,
            'p95_ms': np.percentile(times, 95) * 1000
        }`,
                walk:[
                    {lines:[1,2],note:'Define the ModelQuantizer class centralizing all deployment-format conversions and benchmarking.'},
                    {lines:[3,6],note:'Apply dynamic quantization to Linear and Conv2d layers, converting weights to INT8 for 2-4× size reduction with minimal accuracy loss.'},
                    {lines:[8,11],note:'Trace the model graph with a sample input tensor, producing a TorchScript representation deployable without Python runtime.'},
                    {lines:[13,21],note:'Run N forward passes with no gradient computation, recording wall-clock latency. Return mean and P95 timing for production SLA estimation.'}
                ]
            },
            {
                name:'MLOps & Production', icon:'database',
                desc:'FastAPI inference service with /predict, /batch, /train, /feedback, and /metrics endpoints. MLflow experiment tracking and model registry. Qdrant vector knowledge base for project documentation retrieval. Automated experiment runner with parameter sweeps. GitHub Actions CI pipeline.',
                arch:[
                    {step:'FastAPI Service',desc:'/predict, /batch, /train, /feedback, /metrics'},
                    {step:'MLflow Tracking',desc:'Experiment params, metrics, model registry'},
                    {step:'Qdrant KB',desc:'Vector-indexed project knowledge retrieval'},
                    {step:'Experiment Runner',desc:'Config-driven sweeps, report generation'},
                    {step:'CI Pipeline',desc:'GitHub Actions: test, lint, format'}
                ],
                metrics:[
                    {label:'API Endpoints',val:'8 production routes'},
                    {label:'Tracking',val:'MLflow params + metrics + models'},
                    {label:'Knowledge Base',val:'Qdrant with embedding search'},
                    {label:'CI',val:'GitHub Actions automated'},
                    {label:'Industrial Datasets',val:'CWRU, MAFAULDA, CMAPSS'}
                ],
                tags:['FastAPI','MLflow','Qdrant','DVC','GitHub Actions','Experiment Runner','Production Pipeline'],
                code:null, walk:null
            }
        ]
    },
    {
        id:'wifi-optimizer', title:'AI Wi-Fi Optimiser', status:'✅ Completed', relevance:'⭐⭐⭐⭐⭐',
        statusLabel:'Hackathon Winner — ESP32 Telemetry + Forecasting + Policy Control',
        tagline:'A campus Wi-Fi optimisation stack that watches live congestion, predicts demand trends, and rebalances the network with a safe fallback when the policy is uncertain.',
            images: [],
            galleryMode: 'grid',
        arch:[
            {step:'ESP32 Telemetry',desc:'RSSI, active users, noise, and throughput snapshots'},
            {step:'Feature Window',desc:'Normalised metrics grouped by zone and access point'},
            {step:'Forecast Layer',desc:'Predicts near-term congestion and demand trends'},
            {step:'Policy Engine',desc:'Chooses the next control action'},
            {step:'Safety Layer',desc:'Rule-based guardrails prevent unstable allocations'},
            {step:'Live Dashboard',desc:'Visualises allocation, latency, and recommendation status'}
        ],
        flowDetails:[
            {title:'ESP32 Telemetry',points:['Collects live zone data from the campus side of the system.', 'Tracks user count, RSSI, throughput, and noise as input signals.', 'Feeds the rest of the optimiser with fresh network state.']},
            {title:'Feature Window',points:['Groups recent telemetry into a structured time window.', 'Helps the system see short-term congestion changes instead of single readings.', 'Makes the next decision more stable and context-aware.']},
            {title:'Forecast Layer',points:['Predicts demand trends from the current telemetry window.', 'Supports the control logic with a short-horizon estimate.', 'Helps the optimiser prepare before congestion gets worse.']},
            {title:'Policy Engine',points:['Chooses the next control action for the network.', 'Can prefer balanced, conservative, or aggressive adjustments.', 'Works with the forecast result before the safety layer approves it.']},
            {title:'Safety Layer',points:['Rejects unstable or risky allocation changes.', 'Keeps the network usable even when predictions are uncertain.', 'Acts as the guardrail before any visible change is applied.']},
            {title:'Live Dashboard',points:['Shows the current allocation and recommendation state.', 'Gives a quick view of what the optimiser is doing.', 'Helps the admin explain decisions to users in real time.']}
        ],
        metrics:[
            {label:'Telemetry Source',val:'ESP32 zone snapshots'},
            {label:'Control Loop',val:'Telemetry → forecast → act'},
            {label:'Safety Mode',val:'Offline-safe rule engine'},
            {label:'Decision Style',val:'Policy plus guardrails'},
            {label:'UI Output',val:'Live allocation dashboard'}
        ],
        tags:['ESP32','Forecasting','Policy Control','Python','Flask','Dashboard','Telemetry','Guardrails'],
        code:`# AI Wi-Fi Optimiser — Predict, Decide, Act
class WiFiOptimizer:
    def __init__(self, forecaster, policy, guardrails):
        self.forecaster = forecaster
        self.policy = policy
        self.guardrails = guardrails

    def build_state(self, telemetry):
        return {
            'users': telemetry['users'],
            'rssi': telemetry['rssi'],
            'noise': telemetry['noise'],
            'latency': telemetry['latency'],
            'throughput': telemetry['throughput']
        }

    def optimize(self, telemetry_window):
        state = self.build_state(telemetry_window[-1])
        predicted_load = self.forecaster.predict(telemetry_window)
        action = self.policy.select_action(state, predicted_load)
        safe_action = self.guardrails.validate(action, state)
        return safe_action`,
        walk:[
            {lines:[1,4],note:'Define the optimiser as a compact coordination layer that separates forecasting, decision-making, and safety validation.'},
            {lines:[6,13],note:'Convert raw telemetry into a compact state representation. The control loop only consumes the operational signals that affect congestion and user experience.'},
            {lines:[15,19],note:'Predict the next load window, ask the policy layer for an action, and then pass that action through guardrails so unstable suggestions are blocked.'},
            {lines:[20,20],note:'Return the final safe control decision, which can be displayed in the dashboard or passed to downstream automation.'}
        ]
    },
    {
        id:'sis-gas', title:'Safety Instrumented System — Gas Detection', status:'✅ Completed', relevance:'⭐⭐⭐⭐⭐',
        statusLabel:'Deployed Prototype — ISA-84 Aligned, Hardware Failsafe',
            images: [],
            galleryMode: 'carousel',
        arch:[
            {step:'MQ-6 Sensor',desc:'Analog gas concentration reading'},
            {step:'Analog Perceptron',desc:'LM-358 weighted summation, hardware threshold'},
            {step:'ESP32 MCU',desc:'Dual-read: analog pin + digital safety line'},
            {step:'MQTT Broker',desc:'Local pub/sub, lightweight telemetry'},
            {step:'AWS IoT Core',desc:'Cloud ingestion, device shadow'},
            {step:'AWS Lambda',desc:'Serverless alert processing'},
            {step:'AWS SNS',desc:'SMS + email to safety officers'}
        ],
        metrics:[
            {label:'ISA-84 Alignment',val:'Safety integrity compliant'},
            {label:'Failsafe Mode',val:'Analog circuit triggers relay independently'},
            {label:'Alert Latency',val:'<2s from detection to SMS'},
            {label:'Cloud Independence',val:'Safety shutdown works offline'},
            {label:'MQTT QoS',val:'Level 1 delivery guarantee'}
        ],
        tags:['ESP32','MQ-6','LM-358','IRF9540','MQTT','AWS IoT Core','Lambda','SNS','Analog Design'],
        code:`// ESP32 Dual-Core SIS Gas Monitor (Arduino / FreeRTOS)
#include <WiFi.h>
#include <PubSubClient.h>
#include "freertos/FreeRTOS.h"

const int MQ6_PIN = 34;
const int SAFETY_RELAY = 25;

void core0Task(void * pvParameters) {
  // Core 0: Network & MQTT Processing
  while(1) {
    mqtt_client.loop();
    vTaskDelay(10 / portTICK_PERIOD_MS);
  }
}

void core1Task(void * pvParameters) {
  // Core 1: Sensor Read & Hardware Failsafe
  while(1) {
    int gasLevel = analogRead(MQ6_PIN);
    if(gasLevel > THRESHOLD) {
      digitalWrite(SAFETY_RELAY, HIGH);
      mqtt_client.publish("sis/alert", "LEAK_DETECTED");
    }
    vTaskDelay(100 / portTICK_PERIOD_MS);
  }
}`,
        walk:[
            {lines:[1,4],note:'Include WiFi, MQTT client, and FreeRTOS headers for dual-core task scheduling.'},
            {lines:[6,7],note:'Define hardware pin mappings: MQ-6 analog input and MOSFET-driven safety relay output.'},
            {lines:[9,14],note:'Core 0 task: dedicated to maintaining the MQTT connection and processing incoming messages from AWS IoT Core.'},
            {lines:[16,24],note:'Core 1 task: high-priority loop reading the gas sensor. If threshold is breached, triggers the hardware relay (failsafe) and publishes an MQTT alert simultaneously.'}
        ]
    },
    {
        id:'net-monitor', title:'ESP32 Network Security Monitor', status:'✅ Completed', relevance:'⭐⭐⭐⭐⭐',
        statusLabel:'Dual-Core Embedded — FreeRTOS Isolation',
            images: [],
            galleryMode: 'grid',
        arch:[
            {step:'Core 0 (WiFi Monitor)',desc:'Packet sniffing, 802.11 frame capture'},
            {step:'Core 1 (Processing)',desc:'Scapy backend, threat signature match'},
            {step:'I2C LCD Display',desc:'Local real-time status output'},
            {step:'Alert Trigger',desc:'Threshold-based anomaly notification'}
        ],
        metrics:[
            {label:'Core Isolation',val:'Dual-core FreeRTOS task separation'},
            {label:'Capture Rate',val:'No dropped frames'},
            {label:'Inspection',val:'Scapy deep packet analysis'}
        ],
        tags:['ESP32','FreeRTOS','scapy','Python','I2C LCD','WiFi Monitor Mode'],
        code:`// FreeRTOS Core Pinning for ESP32 Monitor
void setup() {
  Serial.begin(115200);
  xTaskCreatePinnedToCore(
    wifiMonitorTask, "WiFiMon",
    10000, NULL, 1, NULL, 0
  );
  xTaskCreatePinnedToCore(
    processingTask, "ProcTask",
    10000, NULL, 1, NULL, 1
  );
}`,
        walk:[
            {lines:[1,2],note:'Initialize serial communication for debug output at 115200 baud.'},
            {lines:[3,8],note:'Create the WiFi monitoring task and explicitly pin it to Core 0 (protocol CPU), isolating it from application logic.'},
            {lines:[9,13],note:'Create the packet processing and display task, pinning it to Core 1 (application CPU) for independent concurrent execution.'}
        ]
    },
    {
        id:'nyx', title:'Nyx — Device Continuity Protocol Stack', status:'🟡 In Progress', relevance:'⭐⭐⭐⭐',
        statusLabel:'Discovery Layer Complete, Transport WIP',
            images: [],
            galleryMode: 'carousel',
        arch:[
            {step:'mDNS Discovery',desc:'LAN device auto-detection'},
            {step:'WiFi Aware (NAN)',desc:'Routerless P2P discovery'},
            {step:'UDP Fallback',desc:'Legacy compatibility reachability'},
            {step:'Orchestrator',desc:'Caches success, auto failover <1s'},
            {step:'QUIC Transport',desc:'Low-latency multiplexed streaming'}
        ],
        metrics:[
            {label:'Discovery Layers',val:'3-layer with automatic fallback'},
            {label:'Failover Speed',val:'<1s between network layers'},
            {label:'Stack',val:'Rust server + Java client framework'}
        ],
        tags:['Rust','Java','mDNS','WiFi Aware','WiFi Direct','QUIC','USB OTG'],
        code:`// Rust mDNS Discovery Service Skeleton
use mdns::Config;
use mdns::discover;

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let service_type = "_nyx._tcp.local.";
    let receiver = discover::discover(
        service_type, Config::default()
    )?;
    for response in receiver {
        println!("Device found: {:?}",
            response.instance_name());
    }
    Ok(())`,
        walk:[
            {lines:[1,2],note:'Import the mDNS discovery crate and configuration structures for local network scanning.'},
            {lines:[4,7],note:'Define the Nyx service type identifier and initialize the asynchronous discovery receiver.'},
            {lines:[8,11],note:'Iterate over discovered Nyx-compatible devices and log their instance names for context caching and failover logic.'}
        ]
    },
    {
        id:'sanyog', title:'Sanyog — ISL Motion Capture Pipeline', status:'🟡 In Progress', relevance:'⭐⭐⭐',
        statusLabel:'Extraction & Viz Complete, Model WIP',
            images: [],
            galleryMode: 'carousel',
        arch:[
            {step:'Video Input',desc:'RGB camera feed'},{step:'Landmark Extraction',desc:'RTMPose: 133 keypoints'},
            {step:'NPZ Export',desc:'Temporal sequences + confidence'},{step:'Skeleton Viz',desc:'OpenPose-style stick figures'},
            {step:'Dashboard',desc:'React/Node web interface'},{step:'TFLite Export',desc:'Edge gesture recognition (planned)'}
        ],
        metrics:[{label:'Landmarks',val:'133 at 30 FPS'},{label:'Format',val:'(Frames × 133 × 3) NPZ'},{label:'Gesture Library',val:'105 reference gestures'}],
        tags:['MediaPipe','RTMPose','OpenCV','NumPy','React','Node.js','TFLite'],code:null,walk:null
    },
    {
        id:'sar', title:'SAR Water Body Detection & Transferability', status:'📄 Research', relevance:'⭐⭐',
        statusLabel:'Journal Track — Evolving Earth, Elsevier',
            images: [],
            galleryMode: 'grid',
        arch:[
            {step:'Sentinel-1 SAR',desc:'VV/VH polarization raw data'},{step:'SNAP GPT Batch',desc:'Orbit, speckle, terrain correction'},
            {step:'6-Channel Stack',desc:'VV, VH, DEM, HAND, Slope, TWI'},{step:'U-Net Segmentation',desc:'31.4M parameters'},
            {step:'Zero-Shot Transfer',desc:'468 chips, 9 geomorphological types'}
        ],
        metrics:[{label:'Train IoU',val:'0.896'},{label:'Test IoU',val:'0.595 (1.51× degradation)'},{label:'False Positive (Dry)',val:'0.019%'},{label:'Manuscript',val:'EVE-D-26-00034'}],
        tags:['PyTorch','U-Net','SNAP GPT','Google Earth Engine','GDAL','Rasterio','Linux'],code:null,walk:null
    },
    {
        id:'svamitva', title:'SVAMITVA Drone Imagery Segmentation', status:'✅ Completed', relevance:'⭐⭐',
        statusLabel:'IIT Hackathon — Govt of India',
            images: [],
            galleryMode: 'carousel',
        arch:[
            {step:'Drone Orthophoto',desc:'10K-50K pixel input'},{step:'Smart Windowing',desc:'2048×2048 tile extraction'},
            {step:'MobileNetV2 Encoder',desc:'4.2M parameters'},{step:'U-Net Decoder',desc:'Multi-class segmentation'},
            {step:'CPU Inference',desc:'87ms per 512×512 tile'}
        ],
        metrics:[{label:'mIoU',val:'89.9%'},{label:'Pixel Accuracy',val:'97.8%'},{label:'CPU Speed',val:'87ms/tile (i7-12700)'},{label:'Cost Reduction',val:'₹500-800 → ₹150-200/village'}],
        tags:['PyTorch','MobileNetV2','U-Net','OpenCV','CPU Optimization'],code:null,walk:null
    },
    {
        id:'perceptron', title:'Analog Perceptron Circuit', status:'✅ Completed', relevance:'⭐⭐',
        statusLabel:'Simulation Verified — Neuromorphic Interest',
            images: [],
            galleryMode: 'grid',
        arch:[{step:'Input Layer',desc:'2 binary inputs (0V/5V)'},{step:'Weight Stage',desc:'Potentiometer-based adjustable weights'},{step:'Summation',desc:'TL082/UA741 op-amp weighted sum'},{step:'Activation',desc:'MOSFET-driven threshold'},{step:'Output',desc:'LED indicator (ON=1, OFF=0)'}],
        metrics:[{label:'Verified Logic',val:'OR gate behavior confirmed'},{label:'Insight',val:'Analog bridge to neural networks'}],
        tags:['Proteus','Analog Design','Op-Amps','MOSFETs'],code:null,walk:null
    },
    {
        id:'air-quality', title:'India Air Quality Geospatial Pipeline', status:'✅ Completed', relevance:'⭐⭐',
        statusLabel:'Large-Scale Data Engineering',
            images: [],
            galleryMode: 'grid',
        arch:[{step:'Source APIs',desc:'Government air quality data'},{step:'Processing',desc:'Vectorized NumPy, spatial joins'},{step:'Output',desc:'Cleaned CSV, geospatial trends'}],
        metrics:[{label:'Records Processed',val:'9.59M'},{label:'Ops',val:'Vectorized for performance'}],
        tags:['Python','NumPy','Pandas','Geospatial','ETL'],code:null,walk:null
    },
    {
        id:'zerve', title:'Zerve AI Datathon — Health Insurance Claims', status:'✅ Completed', relevance:'⭐',
        statusLabel:'2nd Place National',
            images: [],
            galleryMode: 'carousel',
        arch:[{step:'Ensemble Stack',desc:'LightGBM + XGBoost + CatBoost'},{step:'Feature Engineering',desc:'Domain categorical encoding'},{step:'Validation',desc:'Stratified K-fold, Gini optimization'}],
        metrics:[{label:'Rank',val:'2nd Place National'},{label:'Gini Coefficient',val:'0.2856'}],
        tags:['LightGBM','XGBoost','CatBoost','Scikit-learn'],code:null,walk:null
    }
];

// ============================================================
// RATINGS SYSTEM — Store internal ratings per company
// ============================================================

class RatingsManager {
    constructor() {
        this.storageKey = 'portfolio_ratings';
        this.load();
    }

    load() {
        let stored = null;
        try {
            stored = localStorage.getItem(this.storageKey);
        } catch (err) {
            console.warn('Unable to access localStorage', err);
        }
        const parsed = safeJSONParse(stored, {}, this.storageKey);
        this.ratings = parsed && typeof parsed === 'object' ? parsed : {};
    }

    save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.ratings));
        } catch (err) {
            console.warn('Unable to persist ratings', err);
        }
    }

    setRating(projectId, company, rating, ranking = null, skills = [], notes = '') {
        if (!this.ratings[projectId]) {
            this.ratings[projectId] = {};
        }
        this.ratings[projectId][company] = {
            rating,
            ranking,
            skills,
            notes,
            timestamp: new Date().toISOString()
        };
        this.save();
    }

    getRating(projectId, company) {
        return this.ratings[projectId]?.[company] || null;
    }

    getAllRatings() {
        return this.ratings;
    }

    getProjectRatings(projectId) {
        return this.ratings[projectId] || {};
    }

    deleteRating(projectId, company) {
        if (this.ratings[projectId]) {
            delete this.ratings[projectId][company];
            if (Object.keys(this.ratings[projectId]).length === 0) {
                delete this.ratings[projectId];
            }
            this.save();
        }
    }

    getRankedProjects(company) {
        // Return only rated projects for a company, sorted by ranking first then score.
        const ranked = [];
        PROJECTS.forEach(p => {
            const rating = this.getRating(p.id, company);
            if (rating) {
                ranked.push({
                    ...p,
                    company,
                    companyRating: Number(rating.rating) || 0,
                    companyRanking: rating.ranking === null || rating.ranking === '' ? null : Number(rating.ranking)
                });
            }
        });
        ranked.sort((a, b) => {
            const aHasRank = Number.isFinite(a.companyRanking);
            const bHasRank = Number.isFinite(b.companyRanking);
            if (aHasRank && bHasRank) {
                return a.companyRanking - b.companyRanking || b.companyRating - a.companyRating;
            }
            if (aHasRank !== bHasRank) {
                return aHasRank ? -1 : 1;
            }
            return b.companyRating - a.companyRating;
        });
        return ranked;
    }

    getOrderedProjects(company) {
        const ordered = PROJECTS.map((project, index) => {
            const rating = this.getRating(project.id, company);
            return {
                ...project,
                company,
                companyRating: rating ? Number(rating.rating) || 0 : null,
                companyRanking: rating?.ranking === null || rating?.ranking === undefined || rating?.ranking === ''
                    ? null
                    : Number(rating.ranking),
                __index: index
            };
        });

        return ordered.sort((a, b) => {
            const aHasRank = Number.isFinite(a.companyRanking);
            const bHasRank = Number.isFinite(b.companyRanking);

            if (aHasRank && bHasRank) {
                return a.companyRanking - b.companyRanking || a.__index - b.__index;
            }

            if (aHasRank !== bHasRank) {
                return aHasRank ? -1 : 1;
            }

            return a.__index - b.__index;
        }).map(({ __index, ...project }) => project);
    }

}

    // ============================================================
    // IMAGE GALLERY SYSTEM
    // ============================================================

    class ImageGalleryManager {
        constructor() {
            this.storageKey = 'portfolio_images';
            this.settingsKey = 'portfolio_gallery_settings';
            this.load();
            this.syncProjects();
        }

        load() {
            let stored = null;
            try {
                stored = localStorage.getItem(this.storageKey);
            } catch (err) {
                console.warn('Unable to access localStorage', err);
            }
            const parsed = safeJSONParse(stored, {}, this.storageKey);
            this.images = parsed && typeof parsed === 'object' ? parsed : {};

            let settingsStored = null;
            try {
                settingsStored = localStorage.getItem(this.settingsKey);
            } catch (err) {
                console.warn('Unable to access localStorage', err);
            }
            const settingsParsed = safeJSONParse(settingsStored, {}, this.settingsKey);
            this.settings = settingsParsed && typeof settingsParsed === 'object' ? settingsParsed : {};
        }

        save() {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(this.images));
            } catch (err) {
                console.warn('Unable to persist images', err);
            }
        }

        saveSettings() {
            try {
                localStorage.setItem(this.settingsKey, JSON.stringify(this.settings));
            } catch (err) {
                console.warn('Unable to persist gallery settings', err);
            }
        }

        addImage(projectId, imageUrl, caption = '') {
            const current = this.getImages(projectId);
            current.push({ url: imageUrl, caption, timestamp: new Date().toISOString() });
            this.images[projectId] = current;
            this.save();
            // Also update the PROJECTS array
            this.syncProject(projectId);
        }

        removeImage(projectId, index) {
            const current = this.getImages(projectId);
            if (current.length > index) {
                current.splice(index, 1);
                this.images[projectId] = current;
                this.save();
                this.syncProject(projectId);
            }
        }

        getImages(projectId) {
            const entry = this.images[projectId];
            return Array.isArray(entry) ? entry : [];
        }

        setGalleryMode(projectId, mode) {
            if (!this.settings[projectId]) {
                this.settings[projectId] = {};
            }
            this.settings[projectId].mode = mode;
            this.saveSettings();
            this.syncProject(projectId);
        }

        setGalleryWidth(projectId, width) {
            if (!this.settings[projectId]) {
                this.settings[projectId] = {};
            }
            this.settings[projectId].width = width;
            this.saveSettings();
            this.syncProject(projectId);
        }

        getSettings(projectId) {
            const stored = this.settings[projectId] || {};
            return {
                mode: stored.mode ?? null,
                width: stored.width ?? null
            };
        }

        syncProject(projectId) {
            const proj = PROJECTS.find(p => p.id === projectId);
            if (!proj) return;
            proj.images = this.getImages(projectId);
            const settings = this.getSettings(projectId);
            if (settings.mode) proj.galleryMode = settings.mode;
            if (settings.width !== null && settings.width !== undefined) proj.galleryWidth = settings.width;
        }

        syncProjects() {
            PROJECTS.forEach(project => {
                this.syncProject(project.id);
            });
        }
    }

// Global ratings manager instance
const ratingsManager = new RatingsManager();

// Global image gallery manager instance
const imageGalleryManager = new ImageGalleryManager();
