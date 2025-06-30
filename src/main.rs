use axum::{Router, routing::post, response::IntoResponse};
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer};
use std::{net::SocketAddr, str::FromStr};
use serde::Deserialize;
use spl_token::instruction::initialize_mint;
use base64;
use base64::Engine as _;

#[derive(Deserialize)]
struct CreateTokenRequest {
    #[serde(rename = "mintAuthority")]
    mint_authority: String,
    mint: String,
    decimals: u8,
}

async fn create_token(axum::Json(payload): axum::Json<CreateTokenRequest>) -> impl IntoResponse {
    let mint_pubkey = match Pubkey::from_str(&payload.mint) {
        Ok(pk) => pk,
        Err(_) => {
            return axum::Json(serde_json::json!({
                "success": false,
                "error": "Invalid mint pubkey"
            }));
        }
    };
    let mint_authority_pubkey = match Pubkey::from_str(&payload.mint_authority) {
        Ok(pk) => pk,
        Err(_) => {
            return axum::Json(serde_json::json!({
                "success": false,
                "error": "Invalid mintAuthority pubkey"
            }));
        }
    };

    let instruction = match initialize_mint(
        &spl_token::id(),
        &mint_pubkey,
        &mint_authority_pubkey,
        None,
        payload.decimals,
    ) {
        Ok(instr) => instr,
        Err(_) => {
            return axum::Json(serde_json::json!({
                "success": false,
                "error": "Failed to create instruction"
            }));
        }
    };

    let accounts: Vec<_> = instruction.accounts.iter().map(|meta| {
        serde_json::json!({
            "pubkey": meta.pubkey.to_string(),
            "is_signer": meta.is_signer,
            "is_writable": meta.is_writable
        })
    }).collect();

    let instruction_data = base64::engine::general_purpose::STANDARD.encode(&instruction.data);

    axum::Json(serde_json::json!({
        "success": true,
        "data": {
            "program_id": instruction.program_id.to_string(),
            "accounts": accounts,
            "instruction_data": instruction_data
        }
    }))
}

async fn generate_keypair() -> impl IntoResponse {
    let keypair = Keypair::new();
    let address = keypair.pubkey();
    let secret_key = keypair.to_bytes();

    let response = serde_json::json!({
        "success": true,
        "data": {
            "pubkey": address.to_string(),
            "secret": bs58::encode(secret_key).into_string(),
        }
    });
    axum::Json(response)
}

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/keypair", post(generate_keypair))
        .route("/token/create", post(create_token));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Listening on {}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
