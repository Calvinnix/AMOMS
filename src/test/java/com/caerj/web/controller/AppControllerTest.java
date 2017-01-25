package com.caerj.web.controller;

import org.junit.Before;
import org.junit.Test;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.servlet.view.InternalResourceViewResolver;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Created by Calvin on 1/17/17.
 */
public class AppControllerTest {
    private MockMvc mockMvc;
    private AppController controller;

    @Before
    public void setup() {

        InternalResourceViewResolver viewResolver = new InternalResourceViewResolver();
        viewResolver.setPrefix("/WEB-INF/jsp/view/");
        viewResolver.setSuffix(".jsp");

        controller = new AppController();
        mockMvc = MockMvcBuilders.standaloneSetup(controller)
                                 .setViewResolvers(viewResolver)
                                 .build();
    }

    @Test
    public void home_ShouldRenderApplication() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(view().name("application"));
    }

    @Test
    public void admin_ShouldRenderAdmin() throws Exception {
        mockMvc.perform(get("/admin"))
                .andExpect(view().name("admin"));
    }
}
