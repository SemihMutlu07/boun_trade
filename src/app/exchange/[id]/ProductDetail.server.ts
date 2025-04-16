import {supabase } from '../../lib/supabase';

export async function getProductData(id: string) {
    const {data: product, error} = await supabase
        .from('products')
        .select('id, title, description, category, image_url, is_traded, users_id')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Product Fetch error:', error);
        return null;
    }

    return product;
}