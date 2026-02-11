// ============================================================
// TAMVAI SPEC v1.0 – Fuente de verdad soberana
// Cada dominio, recurso y operación del ecosistema TAMV
// ============================================================

import type { TamvaiSpec } from "./core";

export const TAMVAI_SPEC: TamvaiSpec = {
  version: "1.0.0",
  name: "TAMVAI",
  description:
    "Lenguaje soberano de interfaz para el ecosistema TAMV. Define dominios civilizatorios, recursos, operaciones, guardianías y planes de emergencia.",

  domains: [
    // ============================
    // IDNVIDA – Identidad soberana
    // ============================
    {
      id: "IDNVIDA",
      description: "Identidad, perfiles, trust y acceso",
      resources: [
        {
          id: "User",
          description: "Cuenta de usuario TAMV",
          fields: {
            id: { type: "string" },
            handle: { type: "string" },
            email: { type: "string" },
            trustLevel: { type: "number" },
            displayName: { type: "string" },
            avatarUrl: { type: "string", optional: true },
            nvidaHash: { type: "string", optional: true },
          },
        },
        {
          id: "Role",
          description: "Rol dentro del ecosistema",
          fields: {
            id: { type: "string" },
            userId: { type: "string" },
            role: { type: "string" },
          },
        },
      ],
      operations: [
        {
          id: "User.Signup",
          method: "POST",
          path: "/id/signup",
          resource: "User",
          input: { email: "string", password: "string", fullName: "string" },
          output: { userId: "string", token: "string" },
          auth: { required: false },
          securityTags: ["ANUBIS"],
          monitoringTags: ["HORUS", "RADAR_QUETZALCOATL"],
          description: "Registro de nueva identidad digital ID-NVIDA",
        },
        {
          id: "User.Login",
          method: "POST",
          path: "/id/login",
          resource: "User",
          input: { email: "string", password: "string" },
          output: { token: "string", user: "User" },
          auth: { required: false },
          securityTags: ["ANUBIS"],
          monitoringTags: ["HORUS"],
          description: "Acceso al ecosistema",
        },
        {
          id: "User.GetMe",
          method: "GET",
          path: "/id/me",
          resource: "User",
          input: {},
          output: { user: "User" },
          auth: { required: true, scope: "user" },
          securityTags: ["ANUBIS", "DEKATEOTL"],
          monitoringTags: ["HORUS", "RADAR_OJO_DE_RA"],
        },
        {
          id: "User.UpdateProfile",
          method: "PUT",
          path: "/id/profile",
          resource: "User",
          input: { displayName: "string", bio: "string", avatarUrl: "string" },
          output: { user: "User" },
          auth: { required: true, scope: "user" },
          securityTags: ["ANUBIS", "DEKATEOTL"],
          monitoringTags: ["HORUS"],
        },
      ],
    },

    // ============================
    // SOCIAL – Red social federada
    // ============================
    {
      id: "SOCIAL",
      description: "Feed, posts, reels, comments, likes, follows",
      resources: [
        {
          id: "Post",
          description: "Publicación en el feed",
          fields: {
            id: { type: "string" },
            userId: { type: "string" },
            content: { type: "string" },
            mediaUrls: { type: "string[]", optional: true },
            contentType: { type: "string" },
            likeCount: { type: "number" },
            commentCount: { type: "number" },
            bookpiHash: { type: "string", optional: true },
          },
        },
        {
          id: "Reel",
          description: "Video corto vertical",
          fields: {
            id: { type: "string" },
            userId: { type: "string" },
            videoUrl: { type: "string" },
            caption: { type: "string", optional: true },
            viewCount: { type: "number" },
          },
        },
        {
          id: "Comment",
          description: "Comentario en post",
          fields: {
            id: { type: "string" },
            postId: { type: "string" },
            userId: { type: "string" },
            content: { type: "string" },
          },
        },
      ],
      operations: [
        {
          id: "Feed.GetHome",
          method: "GET",
          path: "/social/feed",
          resource: "Post",
          input: { page: "number", limit: "number" },
          output: { posts: "Post[]", hasMore: "boolean" },
          auth: { required: true, scope: "user" },
          securityTags: ["ANUBIS"],
          monitoringTags: ["HORUS"],
        },
        {
          id: "Post.Create",
          method: "POST",
          path: "/social/posts",
          resource: "Post",
          input: { content: "string", mediaUrls: "string[]", contentType: "string" },
          output: { post: "Post" },
          auth: { required: true, scope: "user" },
          securityTags: ["ANUBIS", "DEKATEOTL"],
          monitoringTags: ["HORUS", "RADAR_OJO_DE_RA"],
          audit: { logPayload: true, redactedFields: [], emergencyPlan: "NONE" },
        },
        {
          id: "Post.Like",
          method: "POST",
          path: "/social/posts/:id/like",
          resource: "Post",
          input: { postId: "string" },
          output: { liked: "boolean" },
          auth: { required: true, scope: "user" },
          securityTags: ["ANUBIS"],
          monitoringTags: ["HORUS"],
        },
        {
          id: "Reel.Create",
          method: "POST",
          path: "/social/reels",
          resource: "Reel",
          input: { videoUrl: "string", caption: "string" },
          output: { reel: "Reel" },
          auth: { required: true, scope: "user" },
          securityTags: ["ANUBIS", "DEKATEOTL"],
          monitoringTags: ["HORUS", "RADAR_OJO_DE_RA"],
        },
      ],
    },

    // ============================
    // MESSAGING – Chat y canales
    // ============================
    {
      id: "MESSAGING",
      description: "Chats, canales, grupos y mensajería en tiempo real",
      resources: [
        {
          id: "Channel",
          description: "Canal de comunicación",
          fields: {
            id: { type: "string" },
            name: { type: "string" },
            channelType: { type: "string" },
            memberCount: { type: "number" },
          },
        },
        {
          id: "Message",
          description: "Mensaje dentro de un canal",
          fields: {
            id: { type: "string" },
            channelId: { type: "string" },
            userId: { type: "string" },
            content: { type: "string" },
          },
        },
        {
          id: "Group",
          description: "Grupo comunitario",
          fields: {
            id: { type: "string" },
            name: { type: "string" },
            slug: { type: "string" },
            memberCount: { type: "number" },
          },
        },
      ],
      operations: [
        {
          id: "Channel.Create",
          method: "POST",
          path: "/messaging/channels",
          resource: "Channel",
          input: { name: "string", channelType: "string" },
          output: { channel: "Channel" },
          auth: { required: true, scope: "user" },
          securityTags: ["ANUBIS", "DEKATEOTL"],
          monitoringTags: ["HORUS"],
        },
        {
          id: "Message.Send",
          method: "POST",
          path: "/messaging/messages",
          resource: "Message",
          input: { channelId: "string", content: "string" },
          output: { message: "Message" },
          auth: { required: true, scope: "user" },
          securityTags: ["ANUBIS"],
          monitoringTags: ["HORUS", "RADAR_OJO_DE_RA"],
        },
        {
          id: "Group.Create",
          method: "POST",
          path: "/messaging/groups",
          resource: "Group",
          input: { name: "string", description: "string" },
          output: { group: "Group" },
          auth: { required: true, scope: "user" },
          securityTags: ["ANUBIS", "DEKATEOTL"],
          monitoringTags: ["HORUS"],
        },
      ],
    },

    // ============================
    // ECONOMY – MSR Blockchain
    // ============================
    {
      id: "ECONOMY",
      description: "Economía MSR, wallets, transacciones, subastas y tips",
      resources: [
        {
          id: "Wallet",
          description: "Billetera MSR del ciudadano",
          fields: {
            id: { type: "string" },
            userId: { type: "string" },
            balanceMsr: { type: "number" },
            lockedMsr: { type: "number" },
          },
        },
        {
          id: "Transaction",
          description: "Transacción registrada en BookPI",
          fields: {
            id: { type: "string" },
            fromUserId: { type: "string" },
            toUserId: { type: "string" },
            amountMsr: { type: "number" },
            bookpiHash: { type: "string" },
          },
        },
        {
          id: "Auction",
          description: "Subasta de obra de arte",
          fields: {
            id: { type: "string" },
            artworkId: { type: "string" },
            startingPriceMsr: { type: "number" },
            currentPriceMsr: { type: "number" },
            isActive: { type: "boolean" },
          },
        },
      ],
      operations: [
        {
          id: "Wallet.GetBalance",
          method: "GET",
          path: "/economy/wallet",
          resource: "Wallet",
          input: {},
          output: { wallet: "Wallet" },
          auth: { required: true, scope: "user" },
          securityTags: ["ANUBIS", "DEKATEOTL"],
          monitoringTags: ["HORUS", "RADAR_QUETZALCOATL"],
        },
        {
          id: "Economy.Transfer",
          method: "POST",
          path: "/economy/transfer",
          resource: "Transaction",
          input: { toUserId: "string", amountMsr: "number", description: "string" },
          output: { txId: "string", bookpiHash: "string" },
          auth: { required: true, scope: "user" },
          securityTags: ["ANUBIS", "DEKATEOTL", "AZTEK_GODS"],
          monitoringTags: ["HORUS", "RADAR_QUETZALCOATL", "RADAR_GEMELOS_MOS"],
          audit: {
            logPayload: true,
            redactedFields: ["toUserId"],
            emergencyPlan: "READ_ONLY",
          },
        },
        {
          id: "Auction.PlaceBid",
          method: "POST",
          path: "/economy/auctions/:id/bid",
          resource: "Auction",
          input: { auctionId: "string", amountMsr: "number" },
          output: { bidId: "string", newPrice: "number" },
          auth: { required: true, scope: "user" },
          securityTags: ["ANUBIS", "DEKATEOTL", "AZTEK_GODS"],
          monitoringTags: ["HORUS", "RADAR_QUETZALCOATL"],
          audit: {
            logPayload: true,
            redactedFields: [],
            emergencyPlan: "READ_ONLY",
          },
        },
      ],
    },

    // ============================
    // COGNITION – Isabella AI
    // ============================
    {
      id: "COGNITION",
      description: "Isabella AI, gobernanza ética, HITL y consciencia civilizatoria",
      resources: [
        {
          id: "IsabellaConversation",
          description: "Conversación con Isabella",
          fields: {
            id: { type: "string" },
            userId: { type: "string" },
            title: { type: "string" },
          },
        },
        {
          id: "IsabellaEvent",
          description: "Evento ético registrado",
          fields: {
            id: { type: "string" },
            conversationId: { type: "string" },
            eventType: { type: "string" },
            ethicalState: { type: "string" },
            riskLevel: { type: "string" },
          },
        },
      ],
      operations: [
        {
          id: "Isabella.Chat",
          method: "POST",
          path: "/cognition/isabella/chat",
          resource: "IsabellaConversation",
          input: { message: "string", layer: "string", sessionId: "string" },
          output: { message: "string", meta: "IsabellaMeta" },
          auth: { required: true, scope: "user" },
          securityTags: ["ANUBIS", "DEKATEOTL"],
          monitoringTags: ["HORUS", "RADAR_OJO_DE_RA", "RADAR_GEMELOS_MOS"],
          audit: {
            logPayload: true,
            redactedFields: [],
            emergencyPlan: "FULL_LOCKDOWN",
          },
        },
        {
          id: "Isabella.ApproveHITL",
          method: "POST",
          path: "/cognition/isabella/approve",
          resource: "IsabellaEvent",
          input: { eventId: "string" },
          output: { approved: "boolean" },
          auth: { required: true, scope: "guardian" },
          securityTags: ["ANUBIS", "DEKATEOTL", "AZTEK_GODS"],
          monitoringTags: ["HORUS", "RADAR_GEMELOS_MOS"],
        },
      ],
    },

    // ============================
    // XRVERSE – Motor gráfico CITEMESH
    // ============================
    {
      id: "XRVERSE",
      description: "CITEMESH Hybrid Rendering Orchestrator y metaverso",
      resources: [
        {
          id: "RenderProfile",
          description: "Perfil de renderizado adaptativo",
          fields: {
            pipeline: { type: "string", description: "HFP | LLP | SAFE" },
            quality: { type: "string", description: "Q0-Q3" },
          },
        },
        {
          id: "RenderMetrics",
          description: "Telemetría de rendimiento en tiempo real",
          fields: {
            clientId: { type: "string" },
            fpsAvg: { type: "number" },
            fpsMin: { type: "number" },
            temperatureC: { type: "number" },
            batteryPct: { type: "number" },
          },
        },
      ],
      operations: [
        {
          id: "HRO.ResolveProfile",
          method: "POST",
          path: "/xrverse/hro/resolve",
          resource: "RenderProfile",
          input: { deviceClass: "string", gpuTier: "string", userPref: "string" },
          output: { profile: "RenderProfile" },
          auth: { required: true, scope: "user" },
          securityTags: ["ANUBIS"],
          monitoringTags: ["HORUS"],
        },
        {
          id: "HRO.SubmitTelemetry",
          method: "POST",
          path: "/xrverse/hro/telemetry",
          resource: "RenderMetrics",
          input: { metrics: "RenderMetrics" },
          output: { nextProfile: "RenderProfile" },
          auth: { required: true, scope: "service" },
          securityTags: ["ANUBIS"],
          monitoringTags: ["HORUS", "RADAR_GEMELOS_MOS"],
        },
      ],
    },

    // ============================
    // EDUCATION – Universidad TAMV
    // ============================
    {
      id: "EDUCATION",
      description: "Universidad TAMV, cursos, lecciones y certificaciones",
      resources: [
        {
          id: "Course",
          description: "Curso educativo",
          fields: {
            id: { type: "string" },
            title: { type: "string" },
            instructorId: { type: "string" },
            level: { type: "string" },
          },
        },
        {
          id: "Enrollment",
          description: "Inscripción de estudiante",
          fields: {
            id: { type: "string" },
            courseId: { type: "string" },
            userId: { type: "string" },
            progress: { type: "number" },
          },
        },
      ],
      operations: [
        {
          id: "Course.List",
          method: "GET",
          path: "/education/courses",
          resource: "Course",
          input: { category: "string", level: "string" },
          output: { courses: "Course[]" },
          auth: { required: false },
          securityTags: [],
          monitoringTags: ["HORUS"],
        },
        {
          id: "Course.Enroll",
          method: "POST",
          path: "/education/courses/:id/enroll",
          resource: "Enrollment",
          input: { courseId: "string" },
          output: { enrollment: "Enrollment" },
          auth: { required: true, scope: "user" },
          securityTags: ["ANUBIS", "DEKATEOTL"],
          monitoringTags: ["HORUS", "RADAR_QUETZALCOATL"],
        },
      ],
    },

    // ============================
    // MEMORY – BookPI Ledger
    // ============================
    {
      id: "MEMORY",
      description: "BookPI blockchain audit ledger y memoria civilizatoria",
      resources: [
        {
          id: "LedgerEntry",
          description: "Entrada inmutable en el ledger BookPI",
          fields: {
            id: { type: "string" },
            entityType: { type: "string" },
            entityId: { type: "string" },
            action: { type: "string" },
            dataHash: { type: "string" },
            prevHash: { type: "string" },
            blockNumber: { type: "number" },
          },
        },
      ],
      operations: [
        {
          id: "BookPI.Query",
          method: "GET",
          path: "/memory/bookpi",
          resource: "LedgerEntry",
          input: { entityType: "string", limit: "number" },
          output: { entries: "LedgerEntry[]" },
          auth: { required: false },
          securityTags: [],
          monitoringTags: ["HORUS"],
        },
        {
          id: "BookPI.Register",
          method: "POST",
          path: "/memory/bookpi",
          resource: "LedgerEntry",
          input: { entityType: "string", entityId: "string", action: "string" },
          output: { entryId: "string", hash: "string" },
          auth: { required: true, scope: "service" },
          securityTags: ["ANUBIS", "DEKATEOTL", "AZTEK_GODS"],
          monitoringTags: ["HORUS", "RADAR_QUETZALCOATL"],
          audit: {
            logPayload: true,
            redactedFields: [],
            emergencyPlan: "FULL_LOCKDOWN",
          },
        },
      ],
    },

    // ============================
    // ART – Galerías y subastas
    // ============================
    {
      id: "ART",
      description: "Galerías de arte, obras y subastas MSR",
      resources: [
        {
          id: "Gallery",
          description: "Galería del artista",
          fields: {
            id: { type: "string" },
            name: { type: "string" },
            userId: { type: "string" },
          },
        },
        {
          id: "Artwork",
          description: "Obra de arte registrada en BookPI",
          fields: {
            id: { type: "string" },
            title: { type: "string" },
            mediaUrl: { type: "string" },
            priceMsr: { type: "number" },
            bookpiHash: { type: "string" },
          },
        },
      ],
      operations: [
        {
          id: "Gallery.List",
          method: "GET",
          path: "/art/galleries",
          resource: "Gallery",
          input: {},
          output: { galleries: "Gallery[]" },
          auth: { required: false },
          securityTags: [],
          monitoringTags: ["HORUS"],
        },
        {
          id: "Artwork.Create",
          method: "POST",
          path: "/art/artworks",
          resource: "Artwork",
          input: { title: "string", mediaUrl: "string", priceMsr: "number" },
          output: { artwork: "Artwork", bookpiHash: "string" },
          auth: { required: true, scope: "creator" },
          securityTags: ["ANUBIS", "DEKATEOTL"],
          monitoringTags: ["HORUS", "RADAR_OJO_DE_RA"],
        },
      ],
    },

    // ============================
    // STREAMING – Live broadcasts
    // ============================
    {
      id: "STREAMING",
      description: "Transmisiones en vivo y streaming",
      resources: [
        {
          id: "Stream",
          description: "Transmisión en vivo",
          fields: {
            id: { type: "string" },
            title: { type: "string" },
            userId: { type: "string" },
            status: { type: "string" },
            viewerCount: { type: "number" },
          },
        },
      ],
      operations: [
        {
          id: "Stream.Create",
          method: "POST",
          path: "/streaming/create",
          resource: "Stream",
          input: { title: "string", description: "string", category: "string" },
          output: { stream: "Stream", streamKey: "string" },
          auth: { required: true, scope: "creator" },
          securityTags: ["ANUBIS", "DEKATEOTL"],
          monitoringTags: ["HORUS", "RADAR_OJO_DE_RA"],
        },
      ],
    },
  ],
};

// ============================
// Utilidades de spec
// ============================
export function findOperation(spec: typeof TAMVAI_SPEC, opId: string) {
  for (const domain of spec.domains) {
    const op = domain.operations.find((o) => o.id === opId);
    if (op) return { domain, operation: op };
  }
  return null;
}

export function findOperationByPath(
  spec: typeof TAMVAI_SPEC,
  path: string,
  method: string
) {
  for (const domain of spec.domains) {
    const op = domain.operations.find(
      (o) => o.path === path && o.method === method
    );
    if (op) return { domain, operation: op };
  }
  return null;
}

export function getDomainStats(spec: typeof TAMVAI_SPEC) {
  return spec.domains.map((d) => ({
    id: d.id,
    description: d.description,
    resourceCount: d.resources.length,
    operationCount: d.operations.length,
    securityCoverage: d.operations.filter((o) => o.securityTags.length > 0).length,
    auditedOperations: d.operations.filter((o) => o.audit).length,
  }));
}
